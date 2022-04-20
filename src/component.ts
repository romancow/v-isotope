/// <reference path="../masonry-layout/index.d.ts" />
import type { VueConstructor, CreateElement, VNode } from 'vue'
import type { PropType } from 'vue/types/options'
import Vue from 'vue'
import Masonry from 'masonry-layout'
import masonry from './directive.js'
import Options from './options.js'
import { keys, mapKeys, mapValues, select, filter, camelcase, addClass } from './utilities.js'

type VMasonry = Vue & {
	readonly disabled: boolean
	readonly items: any[]
	readonly options: Masonry.Options
	readonly modifiers: { [mod: string]: boolean }
	readonly hasItems: boolean

	getInstance(): Masonry | undefined
	renderEmpty(h: CreateElement): VNode[] | null
	renderItems(h: CreateElement): VNode[]
	renderStamp(h: CreateElement): VNode[]
	renderPrepend(h: CreateElement): VNode[]
	renderAppend(h: CreateElement): VNode[]
}

type VMasonryInternal = VMasonry & { instance?: Masonry }

namespace VMasonry {
	export const Defaults: { [key: string]: any } = {
		itemSelector: ".v-masonry-item",
		stamp: ".v-masonry-stamp",
	}

	export const Types: { [opt in keyof Masonry.Options]: PropType<any> } = {

		// Recommended
		itemSelector: String,
		columnWidth: [Number, String],

		// Layout
		gutter: [Number, String],
		horizontalOrder: Boolean,
		percentPosition: Boolean,
		stamp: String,
		fitWidth: Boolean,
		originLeft: Boolean,
		originTop: Boolean,
		hiddenStyle: Object,
		visibleStyle: Object,

		// Setup
		containerStyle: Object,
		transitionDuration: String,
		stagger: [Number, String],
		resize: Boolean,
		resizeContainer: Boolean,
		initLayout: Boolean
	}
}

export default (Vue as VueConstructor<VMasonry>).extend({

	directives: { masonry },

	props: {
		...mapValues(VMasonry.Types, (type, name) => ({ type, default: VMasonry.Defaults[name] ?? null })),
		...mapValues(Options.Negated, (_, name) => ({ type: Boolean, default: VMasonry.Defaults[name] ?? null })),
		disabled: { type: Boolean, default: false },
		items: { type: Array, default: () => [] }
	},

	computed: {
		hasItems() {
			return !!this.items.length
		},

		options() {
			const { disabled, $listeners } = this
			return !disabled && {
				on: mapKeys($listeners, camelcase),
				...filter(select(this, keys(VMasonry.Types))),
			} as Options
		},

		modifiers() {
			return filter(select(this, keys(Options.Negated)))
		}
	},

	methods: {
		getInstance() {
			return Masonry.data(this.$el)
		},

		renderEmpty(this: VMasonryInternal, h: CreateElement): VNode[] | null {
			const { $scopedSlots: { empty }, hasItems, instance } = this
			return hasItems ? null : (empty?.({ instance }) ?? null)
		},

		renderItems(this: VMasonryInternal, h: CreateElement): VNode[] {
			const { $scopedSlots: { item }, items, instance } = this
			return !item ? [] :
				items.map((itm, index) => item({ item: itm, items, index, instance }))
					 .map(rndr =>
						(rndr?.length === 1) ?
							addClass(rndr[0], 'v-masonry-item') :
							h('div', { class: 'v-masonry-item' }, rndr)
					 )
		},

		renderStamp(this: VMasonryInternal, h: CreateElement): VNode[] {
			const { $scopedSlots: { stamp }, items, instance } = this
			return stamp?.({ items, instance })?.map(s => addClass(s, 'v-masonry-stamp')) ?? []
		},

		renderPrepend(this: VMasonryInternal, h: CreateElement): VNode[] {
			const { $scopedSlots: { prepend }, items, instance } = this
			return prepend?.({ items, instance }) ?? []
		},

		renderAppend(this: VMasonryInternal, h: CreateElement) {
			const { $scopedSlots: { append }, items, instance } = this
			return append?.({ items, instance }) ?? []
		}
	},

	render(this: VMasonryInternal, h: CreateElement) {
		const { $scopedSlots: { default: body }, items, options: value, modifiers } = this
		this.instance = this.getInstance()
		const directive = { name: "masonry", value, modifiers }
		const children = body?.({ items }) ?? [
			...this.renderPrepend(h),
			...(this.renderEmpty(h) ?? this.renderStamp(h)),
			...this.renderItems(h),
			...this.renderAppend(h)
		]
		return h('div', { class: 'v-masonry', directives: [directive] }, children)
	}
})

export type { default as Masonry } from 'masonry-layout'
