declare module 'masonry-layout' {
	type Elements = Element | NodeList | Element[]

	class Masonry {
		constructor(options?: Masonry.Options)
		constructor(selector: string | Element, options?: Masonry.Options)

		element: Element
		options: Masonry.Options
		colYs: number[]
		cols: number
		maxY: number
		size: Masonry.Size
	
		// Layout
		layout(): void
		layoutItems(items: Masonry.Item[], isStill?: boolean): void
		ignore(element: Element): void
		unignore(element: Element): void
		stamp(elements: Elements): void
		unstamp(elements: Elements): void
		reveal(items: Masonry.Item[]): void
		hide(items: Masonry.Item[]): void
		revealItemElements(elements: Elements): void
		hideItemElements(elements: Elements): void
	
		// Adding & removing items
		appended(elements: Elements): void
		prepended(elements: Elements): void
		addItems(elements: Elements): void
		remove(elements: Elements): void
	
		// Events
		on(event: Masonry.Event, listener: Masonry.Listener): this
		off(event: Masonry.Event, listener: Masonry.Listener): this
		once(event: Masonry.Event, listener: Masonry.Listener): this
		emitEvent(event: Masonry.Event, args: [Masonry.Item[]]): this
		allOff(): void

		// Utilities
		reloadItems(): void
		destroy(): void
		getItemElements(): Masonry.Item[]
		option(options: Masonry.Options): void
		resizeContainer(): void
		getItem(element: Element): Masonry.Item | undefined
		getItems(elements: Elements): Masonry.Item[]
		static data(element: Element | string): Masonry | undefined
	}

	namespace Masonry {
		interface HiddenOrVisibleStyleOption {
			transform?: string | undefined
			opacity?: number | undefined
		}
	
		interface Options {
			// Recommended
			itemSelector?: string
			columnWidth?: number | string | Element
	
			// Layout
			gutter?: number | string | Element
			horizontalOrder?: boolean
			percentPosition?: boolean
			stamp?: string
			fitWidth?: boolean
			originLeft?: boolean
			originTop?: boolean
			hiddenStyle?: HiddenOrVisibleStyleOption
			visibleStyle?: HiddenOrVisibleStyleOption
	
			// Setup
			containerStyle?: { [rule: string]: string | number }
			transitionDuration?: string | 0
			stagger?: string | number
			resize?: boolean
			resizeContainer?: boolean
			initLayout?: boolean
		}

		type Event = 'layoutComplete' | 'removeComplete' | 'revealComplete' | 'hideComplete'
		type Listener = (items: Item[]) => void

		interface Size {
			borderBottomWidth: number,
			borderLeftWidth: number,
			borderRightWidth: number,
			borderTopWidth: number,
			height: number,
			innerHeight: number,
			innerWidth: number,
			isBorderBox: boolean,
			marginBottom: number,
			marginLeft: number,
			marginRight: number,
			marginTop: number,
			outerHeight: number,
			outerWidth: number,
			paddingBottom: number,
			paddingLeft: number,
			paddingRight: number,
			paddingTop: number,
			width: number
		}

		interface Item {
			element: Element,
			isHidden?: boolean,
			isTransitioning?: boolean,
			layout: Masonry,
			position: { x: number, y: number },
			size: Size,
			staggerDelay: string
		}
	}

	export default Masonry
}
