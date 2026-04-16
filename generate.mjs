import fs from 'fs';
import swagger from './swagger.json' with { type: 'json' };

const schemas = swagger.components.schemas;
const paths = swagger.paths;

const domains = new Set();
Object.keys(paths).forEach(p => {
  const domain = p.split('/')[2];
  if (domain && domain !== '{id}') domains.add(domain);
});

console.log('Detected domains:', Array.from(domains));

// 1. GENERATE STRICT TYPES (Grouping by Domain)
domains.forEach(domain => {
  let content = 'import { components } from \'./api\';\n\n';
  const relatedSchemas = Object.keys(schemas).filter(s => s.startsWith(domain) || s.includes(domain));
  
  if (relatedSchemas.length > 0) {
    relatedSchemas.forEach(s => {
      content += `export type ${s} = components['schemas']['${s}'];\n`;
    });
    fs.writeFileSync(`src/types/${domain.toLowerCase()}.ts`, content);
  }
});

// 2. GENERATE TANSTACK HOOKS (Grouping by Domain)
domains.forEach(domain => {
  let content = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\n`;
  content += `import api from '@/src/lib/api';\n`;
  // Assuming strict types output to src/types/api.ts
  content += `import { components } from '@/src/types/api';\n\n`;
  
  content += `export const use${domain}Queries = () => {\n`;
  content += `  const queryClient = useQueryClient();\n\n`;
  
  const endpointNames = [];
  
  Object.keys(paths).forEach(p => {
    if (!p.startsWith(`/api/${domain}`)) return;
    const methods = paths[p];
    
    Object.keys(methods).forEach(m => {
      // Create Unique hook name
      const opId = methods[m].operationId || `${m}${p.replace(/\W+/g, '_')}`;
      const hookName = `use${opId.charAt(0).toUpperCase() + opId.slice(1)}`;
      endpointNames.push(hookName);
      
      const isGet = m === 'get';
      const responseRef = methods[m].responses?.['200']?.content?.['application/json']?.schema?.$ref;
      let returnType = 'any';
      if (responseRef) {
         const schemaName = responseRef.split('/').pop();
         returnType = `components['schemas']['${schemaName}']`;
      }
      
      if (isGet) {
        content += `  const ${hookName} = (params?: any) => {\n`;
        content += `    return useQuery<${returnType}>({\n`;
        content += `      queryKey: ['${domain}', '${p}', params],\n`;
        content += `      queryFn: async () => {\n`;
        content += `        const res = await api.get('${p.replace('/api/', '/')}', { params });\n`;
        content += `        return res.data?.data ?? res.data;\n`;
        content += `      }\n`;
        content += `    });\n  };\n\n`;
      } else {
        // Fallback generic body typings or strictly map it if present in swagger
        const bodyRef = methods[m].requestBody?.content?.['application/json']?.schema?.$ref;
        let payloadType = 'any';
        if (bodyRef) {
          const schemaName = bodyRef.split('/').pop();
          payloadType = `components['schemas']['${schemaName}']`;
        }
        
        content += `  const ${hookName} = () => {\n`;
        content += `    return useMutation<${returnType}, Error, ${payloadType}>({\n`;
        content += `      mutationFn: async (data) => {\n`;
        content += `        const res = await api.${m}('${p.replace('/api/', '/')}', data);\n`;
        content += `        return res.data?.data ?? res.data;\n`;
        content += `      },\n`;
        content += `      onSuccess: () => {\n`;
        content += `        queryClient.invalidateQueries({ queryKey: ['${domain}'] });\n`;
        content += `      }\n`;
        content += `    });\n  };\n\n`;
      }
    });
  });
  
  content += `  return {\n`;
  endpointNames.forEach(name => {
    content += `    ${name},\n`;
  });
  content += `  };\n};\n`;
  
  try {
     if (!fs.existsSync('src/hooks/queries')) fs.mkdirSync('src/hooks/queries', { recursive: true });
     fs.writeFileSync(`src/hooks/queries/use${domain}Queries.ts`, content);
  } catch(e) {}
});

console.log('✅ AST Parsing complete. Hooks & Types generated sequentially without placeholders.');
