import type { VueConstructor, CreateElement, VNode } from 'vue'
import Vue from 'vue'
import Masonry from 'masonry-layout'
import Options from './options'
import Event from './event'
import { addClass } from './utilities'

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
	renderPrepend(h: CreateElement): VNode[]
	renderAppend(h: CreateElement): VNode[]
}

export default (Vue as VueConstructor<VMasonry>).extend({

	data() {
		return { instance: null }
	},

	props: {
		...Options.toProps(),
		items: { type: Array, default: () => [] }
	},

	computed: {

		hasItems() {
			return !!this.items.length
		},

		options() {
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
		layoutComplete: Event.emitter('layout-complete'),
		removeComplete: Event.emitter('remove-complete'),

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
		},

		renderPrepend(this: VMasonry, h: CreateElement): VNode[] {
			const { $scopedSlots: { prepend }, items } = this
			return prepend?.({ items }) ?? []
		},

		renderAppend(this: VMasonry, h: CreateElement) {
			const { $scopedSlots: { append }, items } = this
			return append?.({ items }) ?? []
		}
	},

	render(this: VMasonry, h: CreateElement) {
		const { $scopedSlots: { default: body }, items } = this
		const children = body?.({ items }) ?? [
			...this.renderPrepend(h),
			...(this.renderEmpty(h) ?? this.renderStamp(h)),
			...this.renderItems(h),
			...this.renderAppend(h)
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
