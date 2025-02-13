import { onCleanup, onMount } from "solid-js";
import CloseButton from "./../assets/close.svg";

function Selection(props) {

    let self;

    function closePrompt() {
        props.onClose();
        self.parentElement.removeChild(self);
    }

    function handleClick() {
        const input = self.querySelector("input");
        props.onClick(input.value);
        closePrompt();
    }

    function handleKeyDown(e) {
        const field = self.querySelector("input");
        if (e.key === "Enter" && !field.classList.contains("invalid")) {
            handleClick();
        }
        if (e.key === "Escape") {
            closePrompt();
        }
    }

    onMount(() => {
        self.addEventListener("keydown", handleKeyDown);
        self.querySelector("input").focus();
    });

    onCleanup(() => {
        self.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div ref={self} class="user-prompt">
            <div class="prompt-title">
                <label>{props.title}</label>
                <div onClick={closePrompt} class="prompt-close">
                    <img src={CloseButton} width="15px" />
                </div>
            </div>
            <div class="prompt-body">
                <div class="selection-prompt">
                    <select class="selection">
                        <For each={props.options}>
                            {(item, index) => (
                                <option>{item}</option>
                            )}
                        </For>
                    </select>
                    <div class="selection-controls">
                        <input type="text" placeholder={props.placeholder} onInput={props.onInput} />
                        <button onClick={handleClick}>{props.button}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Selection;