import { createSignal, onCleanup, onMount } from "solid-js";
import CloseButton from "./../assets/close.svg";

function Confirm(props) {

    const [confirmFocused, setConfirmFocused] = createSignal(true);

    let self;

    function closePrompt() {
        props.onClose();
        self.parentElement.removeChild(self);
    }

    function confirm() {
        props.onConfirm();
        closePrompt();
    }

    function handleKeydown(e) {
        switch (e.key) {
            case "Enter":
                if (confirmFocused()) {
                    confirm();
                } else {
                    closePrompt();
                }
                break;
            case "ArrowRight":
                setConfirmFocused(false);
                self.querySelector(".cancel").focus();
                break;
            case "ArrowLeft":
                setConfirmFocused(true);
                self.querySelector(".confirm").focus();
                break;
            case "Escape":
                closePrompt();
                break;
        }
    }

    onMount(() => {
        self.addEventListener("keydown", handleKeydown);
        self.querySelector(".confirm").focus();
    });

    onCleanup(() => {
        self.removeEventListener("keydown", handleKeydown);
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
                <button class="confirm" onClick={confirm}>Confirm</button>
                <button class="cancel" onClick={closePrompt}>Cancel</button>
            </div>
        </div>
    );
}

export default Confirm;