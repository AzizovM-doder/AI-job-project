## Error Type
Runtime Error

## Error Message
Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.


    at useProfileQueries (src/hooks/queries/useProfileQueries.ts:25:37)
    at <unknown> (src/app/[locale]/profile/page.tsx:229:47)
    at handleSubmit (src/components/profile/LanguageModal.tsx:29:5)
    at form (<anonymous>:null:null)
    at LanguageModal (src/components/profile/LanguageModal.tsx:38:7)
    at ProfilePage (src/app/[locale]/profile/page.tsx:224:9)

## Code Frame
  23 |
  24 | export const useProfileQueries = () => {
> 25 |   const queryClient = useQueryClient();
     |                                     ^
  26 |
  27 |   // --- CORE PROFILE (Identity) ---
  28 |

Next.js version: 16.2.3 (Turbopack)
