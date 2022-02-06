import type { VueConstructor, CreateElement } from 'vue'
import Vue from 'vue'
import Masonry from 'masonry-layout'
import { Options, Methods, Event } from './settings'
import { ScopedSlotChildren } from 'vue/types/vnode'

type VMasonry = Vue & {
	instance: null | Masonry
	readonly items: any[]
	readonly options: Masonry.Options
	layoutComplete(): void
	removeComplete(): void
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

		options() {
			// const options: Isotope.IsotopeOptions = {}
			// Options.keys().forEach(prop => {
			// 	const value = this[prop]
			// 	if (value != null)
			// 		options[prop] = value
			// })
			// flickity.negateOptions.forEach((prop, negated) => {
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
		removeComplete: Event.method('remove-complete')
	},

	render(this: VMasonry, h: CreateElement) {
		const { $scopedSlots: { default: body, item, empty }, items } = this
		const children = body?.({ items }) ?? (
			(empty && !items.length) ? empty({}) :
			item ? items.map(itm => h('div', { class: 'v-masonry-item' }, item(itm))) : null
		) ?? [h()]
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
