import { css } from "@linaria/core";

export const formRoot = css`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`;

export const title = css`
	margin: 0;
	font-size: 1.25rem;
	font-weight: 600;
`;

export const groupFieldset = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 0;
	padding: 1rem;
	border: 1px solid #3f3f46;
	border-radius: 0.5rem;
`;

export const legend = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	width: 100%;
	padding: 0;
	font-size: 0.95rem;
	font-weight: 600;
`;

export const scoreBadge = css`
	display: inline-flex;
	align-items: center;
	padding: 0.2rem 0.55rem;
	border-radius: 999px;
	background: #f4f4f5;
	color: #18181b;
	font-size: 0.75rem;
	font-weight: 600;
	white-space: nowrap;
`;

export const questionBlock = css`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

export const questionLabel = css`
	font-size: 1rem;
	font-weight: 500;
`;

export const controlsRow = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
`;

export const select = css`
	min-width: 18rem;
	height: 2.25rem;
	padding: 0 0.75rem;
	border: 1px solid #3f3f46;
	border-radius: 0.375rem;
	background: transparent;
	color: inherit;
`;

export const textInput = css`
	min-width: 12rem;
	height: 2.25rem;
	padding: 0 0.75rem;
	border: 1px solid #3f3f46;
	border-radius: 0.375rem;
	background: transparent;
	color: inherit;
`;

export const errorText = css`
	margin: 0;
	color: #ef4444;
	font-size: 0.875rem;
`;

export const totalScore = css`
	padding: 0.75rem 1rem;
	border: 1px dashed #52525b;
	border-radius: 0.5rem;
	text-align: center;
	font-weight: 600;
`;
