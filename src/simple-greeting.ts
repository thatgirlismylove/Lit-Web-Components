import {css, html, LitElement} from "lit";
import {property} from "lit/decorators.js";

// @customElement("simple-greeting")
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
    @property({ type: String })
    name: string = 'World';

    // 根据组件状态渲染 ui
    render() {
        return html`<p>Hello ${this.name}</p>`
    }
}

customElements.define('simple-greeting', SimpleGreeting);

declare global {
    interface HTMLElementTagNameMap {
        'simple-greeting': SimpleGreeting
    }
}
