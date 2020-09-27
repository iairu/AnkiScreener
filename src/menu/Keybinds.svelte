<script>
    const keys = [
        ["./img/keys/lmb.svg", "Add selection"],
        ["./img/keys/rmb.svg", "Add group"],
        ["./img/keys/x.svg", "Remove last sel."],
        ["./img/keys/c.svg", "Remove last group"],
        ["./img/keys/enter.svg", "Confirm -> CSV"],
    ]
</script>

<details id="keybinds" class="dimmed" open>
    <summary>Keybinds</summary>
    <div class="keybindRow">
        {#each keys as key}
        <div class="keybind">
            <img src={key[0]} alt={key[1] + " Keybind"} class="icon">
            <label for="keybind">{key[1]}</label>
        </div>
        {/each}
    </div>
</details>