export type Photo = {
	large: string
	thumb: string
	width: number
	height: number
	caption?: string
	css?: string
	style?: (...args: any[]) => string
}
