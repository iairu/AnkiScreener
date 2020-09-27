<script>
    import { groups } from "../store";
</script>

<div id="groups">
{#each $groups as group}
    <details class="group">
        <summary>
            <input type="text" placeholder="Group" value={group.name}>
        </summary>
        <div>
            <input type="text" name="prefix" id="group_n_prefix" placeholder="Prefix" value={group.prefix}><br>
            <input type="text" name="suffix" id="group_n_suffix" placeholder="Suffix" value={group.suffix}>
        </div>
    </details>
{/each}
</div>