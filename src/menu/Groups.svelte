<script>
    import { groups, modifySelection } from "../store";

    function handleGroupName(e) {
        modifySelection(true,parseInt(e.target.getAttribute("key")),{name:e.target.value});
    }
</script>

<div id="groups">
{#each $groups as group, i}
    <details class="group">
        <summary>
            <input type="text" key={i} placeholder={"Group " + (i + 1)} value={group.name} on:input={handleGroupName}>
        </summary>
        <div>
            <input type="text" key={i} name="prefix" id="group_n_prefix" placeholder="Prefix" value={group.prefix}><br>
            <input type="text" key={i} name="suffix" id="group_n_suffix" placeholder="Suffix" value={group.suffix}>
        </div>
    </details>
{/each}
</div>