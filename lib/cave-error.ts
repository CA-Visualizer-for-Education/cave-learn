export type CaveErrorCode =
  | 'INVALID_URL'
  | 'REPO_UNAVAILABLE'
  | 'ANALYSIS_FAILED'
  | 'UNKNOWN';

export class CaveError extends Error {
  readonly code: CaveErrorCode;

  constructor(code: CaveErrorCode, message: string) {
    super(message);
    this.name = 'CaveError';
    this.code = code;
  }
}

export type SubmitRepoResult =
  | { ok: true; owner: string; repo: string }
  | { ok: false; code: CaveErrorCode };
