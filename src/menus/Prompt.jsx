import { onCleanup, onMount } from "solid-js";
import CloseButton from "./../assets/close.svg";

function Prompt(props) {

    let self;

    function closePrompt() {
        props.onClose();
        self.parentElement.removeChild(self);
    }

    function handleKeydown(e) {
        const field = self.querySelector("input");
        if (e.key === "Enter" && !field.classList.contains("invalid")) {
            handleClick();
        }
        if (e.key === "Escape") {
            closePrompt();
        }
    }

    function handleClick() {
        const input = self.querySelector("input");
        props.onClick(input.value);
        closePrompt();
    }

    onMount(() => {
        self.addEventListener("keydown", handleKeydown);
        self.querySelector("input").focus();
    })

    onCleanup(() => {
        self.removeEventListener("keydown", handleKeydown);
    })

    return (
        <div ref={self} class="user-prompt">
            <div class="prompt-title">
                <label>{props.title}</label>
                <div onClick={closePrompt} class="prompt-close">
                    <img src={CloseButton} width="15px" />
                </div>
            </div>
            <div class="prompt-body">
                <input type={props.type} placeholder={props.placeholder} onInput={props.onInput} />
                <button onClick={handleClick}>{props.button}</button>
            </div>
        </div>
    );
}

export default Prompt;