# 使用 Lit 构建 Web Components

### 介绍 Lit

[Lit](https://lit.dev/docs/) 是一个用于构建 Web Components 的现代框架，它基于 Web Components
标准构建，旨在帮助开发者更高效地创建高性能、可复用的组件。

### 使用 vite 快速创建一个包含 Lit 的项目

```shell
pnpm create vite lit-web-components --template lit-ts
```

安装依赖

```shell
pnpm install
```

启动项目

```shell
pnpm dev
```

### 组件的基本概念

一个 Lit 组件是一个可复用的 UI 单元。你可以将 Lit 组件看作一个包含一些状态的容器，并根据其状态展示
UI。它还可以响应用户输入、触发事件——也就是说，能够完成你对一个 UI 组件的所有期望。此外，Lit 组件是一个 HTML 元素，因此它拥有所有标准的元素
API。

创建一个 Lit 组件涉及到以下几个概念：

1. 定义组件：Lit 组件被实现为自定义元素（Custom Element），需要注册到浏览器中。
2. 渲染：每个组件都有一个 render 方法，用于渲染组件的内容。在该方法中，你可以定义组件的模板。
3. 响应式属性：属性用于保存组件的状态。当组件的响应式属性发生变化时，会触发更新周期，从而重新渲染组件。
4. 样式：组件可以定义封装的样式，用于控制自身的外观，样式默认与组件外部隔离。
5. 生命周期：Lit 定义了一组生命周期回调方法，开发者可以重写这些方法来在组件的生命周期中插入自定义逻辑。例如，在元素被添加到页面时运行代码，或者在组件更新时执行特定操作。
    * connectedCallback:元素被添加到页面时调用。
    * disconnectedCallback:元素从页面移除时调用。
    * updated(changedProperties):响应式属性更新后调用。
    * firstUpdated(changedProperties):元素首次更新完成后调用。

在 src 目录下面新建一个 simple-greeting.ts 文件，加入以下代码

```ts
import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement("simple-greeting")
export class SimpleGreeting extends LitElement {
    // 使用普通的 css 定义作用域内的样式,这些样式默认通过 Shadow Dom 实现隔离
    // 仅作用于组件内部，不会影响外部样式

    // css`` 是 es6 “标签模板”功能（tagged template）
    static styles = css`
        :host {
            color: blue;
        }
    `

    // 声明响应式属性
    @property()
    name?: string = 'World';

    // 根据组件状态渲染 ui
    render() {
        return html`<p>Hello ${this.name}</p>`
    }
}
```

在 index.html 文件 head 标签的底部引入 simple-greeting.ts

```html

<script type="module" src="/src/simple-greeting.ts"></script>
```

在 body 标签的底部使用 lit 组件

```html

<simple-greeting/>
```

运行项目，页面上会出现蓝色的 **Hello World**。

### 定义组件

观察 simple-greeting.ts 代码，你会发现 @customElement() 装饰器，实际上它只是 customElements.define 的语法糖。

删除 @customElement('simple-greeting') 在底部添加以下代码：

```ts
customElements.define('simple-greeting', SimpleGreeting);
```

装饰器语法是 ts 环境下的，如果你的项目使用是 js，就可以用上面的方式实现同样的效果。

#### lit 组件是一个 html element

当你定义了一个 lit 组件，实际上你也定义了一个 **custom HTML element**。

所以你也可以像创建 html 元素一样，去创建一个 lit 组件。

```html

<script>
    const greeting = document.createElement('simple-greeting');
    document.body.appendChild(greeting);
</script>
```

使用上面的代码，你就能在页面上看到新增了一个 **Hello World**

LitElement 是 HTMLElement 的子类，它继承了所有 HTMLElement 的属性和方法。

实际上，LitElement 继承了 ReactiveElement，而 ReactiveElement 继承自 HTMLElement。

他们的关系就像下面这样。

```plaintext
LitElement <- ReactiveElement <- HTMLElement
```

#### 提供 TYpeScript 类型声明

TypeScript 会根据标签名推断出某个 DOM api 返回的HTML元素的类。例如，document.createElement（'img'）返回一个带有src:
string属性的HTMLImageElement实例。

自定义元素可以通过添加HTMLElementTagNameMap来获得相同的处理，如下所示：

```ts
declare global {
    interface HTMLElementTagNameMap {
        'simple-greeting': SimpleGreeting
    }
}
```

建议为所有用TypeScript编写的元素添加一个HTMLElementTagNameMap条目

### 渲染

向组件添加一个模板来定义它应该呈现的内容。模板可以包含表达式，表达式是动态内容的占位符。要为一个Lit组件定义一个模板，添加一个render()
方法

```ts
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('my-element')
class MyElement extends LitElement {

    render() {
        return html`<p>Hello from my template.</p>`;
    }
}
```

在 Lit 中，模板是通过 html 函数定义的，它使用 JavaScript 标签模板文字（tagged template literals）。这种方式支持将 HTML 和
JavaScript 表达式结合，用于动态设置内容、属性、事件监听器等。

#### 可渲染的数据类型

1. 基本数据类型：字符串、数字、布尔值
2. TemplateResult 对象 : 由 html 标签函数创建的内容,例如 html`<p>Hello, Lit!</p>`
3. DOM 节点（DOM Nodes）: <p>内容</p>
4. 特殊值：nothing 和 noChange：
    * nothing：表示不渲染任何内容，适用于条件渲染
    * noChange：表示不更新现有内容
5. 数组或者可迭代对象：遍历对象渲染多个元素
   ```ts
   render()
   {
    const items = [1, 2, 3];
    return html`<ul>${items.map(item => html`<li>${item}</li>`)}</ul>`;
   }
   ```
6. SVG 模板: 使用 svg 函数创建的 SVGTemplateResult，仅能渲染为 <svg> 标签的子节点，并且不能被 render 方法的直接返回。

#### 组合模板

你可以从其他模板组合Lit模板。下面的例子为一个名为<my-page>的组件合成了一个模板，这个模板是由页面的页眉、页脚和主内容的小模板组成的：

```ts
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';


@customElement('my-page')
class MyPage extends LitElement {

    @property({attribute: false})
    article = {
        title: 'My Nifty Article',
        text: 'Some witty text.',
    };

    headerTemplate() {
        return html`<header>${this.article.title}</header>`;
    }

    articleTemplate() {
        return html`<article>${this.article.text}</article>`;
    }

    footerTemplate() {
        return html`<footer>Your footer here.</footer>`;
    }

    render() {
        return html`
      ${this.headerTemplate()}
      ${this.articleTemplate()}
      ${this.footerTemplate()}
    `;
    }
}
```

在这个例子中，单个模板被定义为实例方法，因此子类可以扩展该组件并覆盖一个或多个模板。你也可以通过导入其他元素并在你的模板中使用它们来组成模板：

```ts
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import './my-header.js';
import './my-article.js';
import './my-footer.js';

@customElement('my-page')
class MyPage extends LitElement {
    render() {
        return html`
      <my-header></my-header>
      <my-article></my-article>
      <my-footer></my-footer>
    `;
    }
}
```

对组件的响应式模板进行修改会触发组件的更新，lit 组件是异步批量更新操作，同时修改多个属性值，只会触发一次更新，并在微任务定时异步执行

Lit使用Shadow DOM来封装组件渲染的DOM。**Shadow DOM**允许元素创建自己的、独立于主文档树的DOM树。它是web组件规范的核心特性，支持互操作性、样式封装和其他好处。

### 响应式属性

Lit组件接收输入并将其状态存储为JavaScript类字段或属性。响应式属性是在被更改、重新呈现组件以及可选地读取或写入属性时触发响应式更新周期的属性。

```ts
class MyElement extends LitElement {
    @property()
    name?: string;
}
```

Lit 管理组件的 响应式属性 及其对应的 HTML 属性，为开发者提供了高效和便捷的状态管理机制。以下是 Lit 的具体处理方式：

* 响应式更新：属性值改变会自动调度更新，触发重新渲染
* 属性处理：属性值与 HTML 属性默认双向同步，可通过 reflect: true 实现属性到 HTML 的反射
* super 属性继承：自动继承超类中声明的属性选项，避免重复声明。
* 元素升级逻辑：在组件定义后，自动处理 DOM 中已存在的实例，确保属性更新正确触发副作用。

#### 公共属性与内部响应式状态

在 Lit 中，公共属性和内部响应式状态是两种不同用途的属性设计，它们的使用和管理方式也有所不同：

公共属性（Public Properties）：

* 定义：
  公共属性是组件 公开 API 的一部分，通常用于接收组件外部传入的输入数据。
* 特点：
    * 输入性质：公共属性通常是组件的输入，组件应该尽量避免主动修改它们，除非是响应式用户交互时需要更新。
    * 响应式：公共属性可以是响应式的，当它们发生变化时，组件会重新渲染
    * 属性反射：公共属性可以选择是否反射到 HTML 属性 （通过 reflect: true）

公共属性可以通过 **@property** 装饰器去声明，例如下面这种写法：

```ts
class MyElement extends LitElement {
    @property({type: String})
    mode?: string;

    @property({attribute: false})
    data = {};
}
```

或者在静态属性类字段中声明属性：

```ts
class MyElement extends LitElement {
    static properties = {
        mode: {type: String},
        data: {attribute: false},
    };

    constructor() {
        super();
        this.data = {};
    }
}
```

内部响应式状态（Internal Reactive State）

* 定义：内部响应式状态是组件的私有状态，不是组件 api 的一部分。这些状态通常不与 HTML 属性对应，且在 TypeScript 中会标记为
  protected 或 private。
* 特点：
    * 私有性：外部无法直接访问或修改这些属性
    * 用途：用于组件内部的逻辑控制或状态管理
    * 非反射：这些属性不会映射到 DOM 属性

使用 **@state** 装饰器可以声明一个内部响应式状态

```
@state()
protected _active = false;
```

使用静态属性类字段，您可以使用state: true选项来声明内部响应状态

```
static properties = {
  _active: {state: true}
};

constructor() {
  this._active = false;
}
```

内部反应状态不应该从组件外部引用。在TypeScript中，这些属性应该被标记为private或protected。我们还建议使用像前导下划线（_
）这样的约定来标识JavaScript用户的私有或受保护的属性

### 样式

在 Lit 中，组件的模板会渲染到它的**shadow root**中。你为组件添加的样式会自动作用于shadow root中的元素，只影响该shadow
root中的内容。

Shadow DOM 提供了强大的样式封装功能。如果 Lit 不使用 Shadow
DOM，你将不得不非常小心，以避免无意中样式化组件外部的元素（包括父级元素或子级元素）。这通常意味着需要写出冗长、难以使用的类名来确保样式只应用于特定的元素。而使用
Shadow DOM，Lit 确保了你编写的选择器只会影响 Lit 组件的影子根中的元素。

#### 给组件添加样式

使用 css 标签函数可以定义有作用域的样式，这种方式定义样式可以获得最优的性能

```ts
import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
    static styles = css`
    p {
      color: green;
    }
  `;

    protected render() {
        return html`<p>I am green!</p>`;
    }
}
```

添加到组件中的样式使用shadow DOM限定作用域，静态样式类字段的值可以是：

```
static styles = css`...`;
```

或者添加多个

```
static styles = [ css`...`, css`...`];
```

