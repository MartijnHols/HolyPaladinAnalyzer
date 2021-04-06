export const IGNORE_PREVIOUS_PATCH_WARNING = 'IGNORE_PREVIOUS_PATCH_WARNING';
export function ignorePreviousPatchWarning(reportCode: string) {
  return {
    type: IGNORE_PREVIOUS_PATCH_WARNING,
    payload: reportCode,
  };
}
