# v-masonry
The [Masonry cascading grid layout library](https://masonry.desandro.com/) as a Vue directive and component.

## Peer Dependenices
- [vue](https://www.npmjs.com/package/vue)

```
npm install vue
```

## Installation

Add a scope mapping for the GitHub npm package manager by adding a `.npmrc` file with the line:
```
@romancow:registry=https://npm.pkg.github.com/
```

Then install the package:
```
npm install @romancow/v-masonry
```
or
```
yarn add @romancow/v-masonry
```

More info on using the GitHub npm package registry [here](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#installing-a-package).

## Usage

v-masonry can be used as either a Vue directive or a Vue component (or both, I guess if that's what you want). Both methods provide different advantages. The directive can give you a lot more control of the markup, while the component provides slots that can be a lot easier with less "plumbing".

Import just the directive like `import masonry from '@romancow/v-masonry/directive'`.

Import just the componet like `import VMasonry from '@romancow/v-masonry/component'`.

And you can import both together like `import { masonry, VMasonry } from '@romancow/v-masonry'`.

### Using As A Directive

#### Basic Example

```javascript
import masonry from '@romancow/v-masonry/directive'

new Vue({
	directives: { masonry },
	el: '#app',
	data: {
		items: ["one", "two", "three", "four"]
	}
})
```

```html
<div id="app">
	<div v-masonry>
		<div v-for="item in items">{{ item }}</div>
	</div>
</div>
```

#### Options

<!-- The [Masonry options](https://masonry.desandro.com/options.html) can be set as either the directive value or as modifiers (if it's a boolean option). -->

You can pass an [Masonry options](https://masonry.desandro.com/options.html) object as the directive's value:

```html
<div v-masonry="{ itemSelector: '.v-masonry-item', columnWidth: 80, stamp: '.v-masonry-stamp' }">
	...
</div>
```

The options object can also come from Vue data or a computed value:

```javascript
new Vue({
	directives: { masonry },
	el: '#app',
	data: {
		options: { itemSelector: ".v-masonry-item", columnWidth: 80, stamp: ".v-masonry-stamp" }
	}
})
```

```html
<div v-masonry="options">
	...
</div>
```

If the directive's value is a `string`, then this is used as the [`itemSelector`](https://masonry.desandro.com/options.html#itemselector) option:

```html
<div v-masonry="'.v-masonry-item'">
	...
</div>
```

If the directive's value is a `number`, then this is used as the [`columnWidth`](https://masonry.desandro.com/options.html#columnwidth) option:

```html
<div v-masonry="80">
	...
</div>
```

If the directive's value is a `boolean`, then it can be used to enable (`true`) or disable (`false`) masonry.

In addition to setting options using the directive's value, you can also set boolean options as modifiers using kebab-case versions of the option name: 

```html
<div v-masonry.horizontal-order.percent-position="'.v-masonry-item'">
	...
</div>
```

In addition existing boolean Masonry options, there are a few extras provided as modifiers for options that are already `true` by default:

- `origin-right`: sets `originLeft` to `false`
- `origin-bottom`: sets `originTop` to `false`
- `no-resize`: sets `resize` to `false`

```html
<div v-masonry.origin-right.origin-bottom.no-resize="'.v-masonry-item'">
	...
</div>
```

#### Events

v-masonry provides access to the [Masonry events](https://masonry.desandro.com/events.html#masonry-events) by allowing you to pass their handlers as an `on` option in the directive's value:

```html
<div v-masonry="{ itemSelector: '.v-masonry-item', on: { layoutComplete: eventHandler }}">
	...
</div>
```

In addition to the two standard Masonry events ([`layoutComplete`](https://masonry.desandro.com/events.html#layoutcomplete) & [`removeComplete`](https://masonry.desandro.com/events.html#removecomplete)), v-masonry also provides the `created` and `destroyed` events for when the directive creates a new Masonry instance or destroys one. Each of these handlers will receive the created/destroyed Masonry instance as it's one argument.

### Using As A Component

#### Basic Example

```javascript
import VMasonry from '@romancow/v-masonry/component'

new Vue({
	components: { VMasonry },
	el: '#app',
	data: {
		items: ["one", "two", "three", "four"]
	}
})
```

```html
<div id="app">
	<v-masonry :items="items">
		<template #item="{ item }">
			<div>{{ item }}</div>
		<template>

		<template #empty>
			<p>There are no items to show.<p>
		</template>
	</v-masonry>
</div>
```

#### Options

All [Masonry Options](https://masonry.desandro.com/options.html) correspond to [Vue component props](https://vuejs.org/v2/guide/components-props.html):

```html
<v-masonry :items="items" itemSelector=".v-masonry-item" :columnWidth="80" stamp=".v-masonry-stamp">
	...
</v-masonry>
```

There are also a few additional props that provide `false` values for existing Masonry options that have a default `true` value:

- `origin-right`: sets `originLeft` to `false`
- `origin-bottom`: sets `originTop` to `false`
- `no-resize`: sets `resize` to `false`

```html
<v-masonry origin-right origin-bottom no-resize>
	...
</v-masonry>
```

And you can set the `disabled` (`boolean`) prop to turn Masonry "on" or "off":

```javascript
new Vue({
	components: { VMasonry },
	data: {
		useMasonry: true
	},
	methods: {
		toggleUse() {
			this.useMasonry = !this.useMasonry
		}
	}
})
```

```html
<button @click="toggleUse">Toggle</button>
<v-masonry :disabled="useMasonry">
	...
</v-masonry>
```

#### Events

[Masonry events](https://masonry.desandro.com/events.html) are mapped as kebab-cased [Vue component events](https://vuejs.org/v2/guide/events.html).

```html
<v-masonry @layout-complete="eventHandler">
	...
</v-masonry>
```

In addition to the two standard Masonry events ([`layoutComplete`](https://masonry.desandro.com/events.html#layoutcomplete) & [`removeComplete`](https://masonry.desandro.com/events.html#removecomplete)), v-masonry also provides `created` and `destroyed` events, emitted when the component creates a new Masonry instance or destroys one. Each of these pass the created/destroyed Masonry instance as it's one argument:

```javascript
new Vue({
	components: { VMasonry },
	data: {
		masonryInstance: null
	},
	methods: {
		instanceCreated(instance) {
			this.masonryInstance = instance
		}
	}
})
```

```html
<v-masonry @created="instanceCreated">
	...
</v-masonry>
```

#### Slots

The VMasonry component provides several slots to easily do common things:

##### item

Used to render the child elements that will be used as item elements in the layout.

```html
<v-masonry :items="items">
	<template #item="{ item, index }">
		<div :class="{ purple: item.isPurple }">
			<p>Name: {{ item.name }}</p>
			<p>Index: {{ index }}</p>
		</div>
	</template>
</v-masonry>
```

##### empty

Rendered in place of `#item` if the component's `items` property is empty.

```html
<v-masonry :items="items">
	<template #item="{ item }">
		...
	</template>

	<template #empty>
		<div>Sorry, we're all out of items.</div>
	</template>
</v-masonry>
```

##### stamp

Elements in this slot are elements that will be ["stamped"](https://masonry.desandro.com/options.html#stamp) within the layout.

```html
<v-masonry :items="items">
	<template #item="{ item }">
		...
	</template>

	<template #stamp="{ items }">
		<div>This is stamped</div>
		<div>There are {{ items.length }} items</div>
	</template>
</v-masonry>
```

##### prepend

Static elements that will be rendered before `#items`, `#empty`, or `#stamp`.

```html
<v-masonry :items="items">
	<template #prepend="{ items }">
		<div>There are {{ items.length }} items</div>
	</template>

	<template #item="{ item }">
		...
	</template>
</v-masonry>
```

##### append

Static elements that will be rendered after `#items`, `#empty`, or `#stamp`.

```html
<v-masonry :items="items">
	<template #item="{ item }">
		...
	</template>

	<template #append="{ items }">
		<div>There are {{ items.length }} items</div>
	</template>
</v-masonry>
```

##### default

If a deafult slot is specified, it's contents will override all other slots as the contents within the Masonry instance's root node, allowing you to comletely customize its contents. You can use the default item selector class `v-masonry-item` and the default stamp class `v-masonry-stamp`, or specify your own with the [`itemSelector`](https://masonry.desandro.com/options.html#itemselector) and [`stamp`](https://masonry.desandro.com/options.html#stamp) options.

```html
<v-masonry>
	<div class="v-masonry-stamp">There are {{ items.length }} items</div>

	<div v-for="item in items" class="v-masonry-item" :class="{ purple: item.isPurple }">
		<p>Name: {{ item.name }}</p>
	</div>
</v-masonry>
```
