import type { VueConstructor, CreateElement, VNode } from 'vue'
import Vue from 'vue'
import Masonry from 'masonry-layout'
import { Options, Methods, Event } from './settings'

type VMasonry = Vue & {
	instance: null | Masonry
	readonly items: any[]
	readonly options: Masonry.Options
	readonly hasItems: boolean
	layoutComplete(): void
	removeComplete(): void

	renderEmpty(h: CreateElement): VNode[] | null
	renderItems(h: CreateElement): VNode[]
	renderStamp(h: CreateElement): VNode[]
}

function addClass(node: VNode, cls: string) {
	let classes = (node.data ??= {}).class ?? []
	if (typeof classes === "string")
		classes = [classes, cls]
	else if (Array.isArray(classes))
		classes.push(cls)
	else classes[cls] = true
	node.data.class = classes
	return node
}

export default (Vue as VueConstructor<VMasonry>).extend({

	data() {
		return { instance: null }
	},

	props: {
		...Options.Props,
		items: { type: Array, default: () => [] }
	},

	computed: {

		hasItems() {
			return !!this.items.length
		},

		options() {
			// const options: Masonry.Options = {}
			// Options.keys().forEach(prop => {
			// 	const value = this[prop]
			// 	if (value != null)
			// 		options[prop] = value
			// })
			// masonry.negateOptions.forEach((prop, negated) => {
			// 	const value = this[negated]
			// 	if (value != null)
			// 		options[prop] = !value
			// })
			// return options
			return Options.select(this)
		}

	},

	watch: {

		instance: {
			handler(this: VMasonry, instance: Masonry | null, old: Masonry | null) {
				if (old != null)
					Event.All.forEach(event => old.off(event, this[event]))
				if (instance != null)
					Event.All.forEach(event => instance.on(event, this[event]))
			},
			immediate: true
		},

		options(options: Masonry.Options) {
			const { instance } = this
			if (instance) {
				instance.options = options
				this.instance?.layout()
			}
		}

	},

	methods: {
		...Methods.map(),
		layoutComplete: Event.method('layout-complete'),
		removeComplete: Event.method('remove-complete'),

		renderEmpty(this: VMasonry, h: CreateElement): VNode[] | null {
			const { $scopedSlots: { empty }, hasItems } = this
			return hasItems ? null : (empty?.({}) ?? null)
		},

		renderItems(this: VMasonry, h: CreateElement): VNode[] {
			const { $scopedSlots: { item }, items } = this
			return !item ? [] :
				items.map((itm, index) => item({ item: itm, items, index }))
					 .map(rndr =>
						(rndr?.length === 1) ?
							addClass(rndr[0], 'v-masonry-item') :
							h('div', { class: 'v-masonry-item' }, rndr)
					 )
		},

		renderStamp(this: VMasonry, h: CreateElement): VNode[] {
			const { $scopedSlots: { stamp }, items } = this
			return stamp?.({ items })?.map(s => addClass(s, 'v-masonry-stamp')) ?? []
		}
	},

	render(this: VMasonry, h: CreateElement) {
		const { $scopedSlots: { default: body }, items } = this
		const children = body?.({ items }) ?? [
			...(this.renderEmpty(h) ?? this.renderStamp(h)),
			...this.renderItems(h)
		]
		return h('div', { class: 'v-masonry' }, children)
	},

	mounted(this: VMasonry) {
		this.$nextTick(() => {
			const { $el, options } = this
			this.instance = new Masonry($el as HTMLElement, options)
		})
	},

	updated() {
		this.$nextTick(() => this.instance?.reloadItems())
	},

	destroyed(this: VMasonry) {
		const { instance } = this
		instance?.destroy()
		this.instance = null
	}

})
