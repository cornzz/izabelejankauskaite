export function clickOutside(element: HTMLElement, callback: () => void) {
	function handleClick(event: MouseEvent) {
		if (!element.contains(event.target as HTMLElement)) {
			callback()
		}
	}

	document.body.addEventListener('click', handleClick)

	return {
		update(newCallback: () => void) {
			callback = newCallback
		},
		destroy() {
			document.body.removeEventListener('click', handleClick)
		}
	}
}
