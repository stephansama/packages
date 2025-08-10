const json = String.raw;

const ts = String.raw;

export const tsComment = ts`/// <reference types="@stephansama/github-env" />`;

export const tsConfig = json`
{
  "compilerOptions": {
	"types": ["@stephansama/github-env"]
  }
}
`;
