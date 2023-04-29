<script>
    // @ts-nocheck
    import { highlight } from "$lib/stores";
    import { awayScore, homeScore, time } from "$lib/collections";

    export let results = [];
</script>

{#if results.length > 0}
    <table class="table tp">
        <thead>
            <tr>
                <th class="text-center" />
                <th class="text-right">home</th>
                <th colspan="2" />
                <th class="text-left">away</th>
            </tr>
        </thead>
        <tbody>
            <!-- TODO: results needs to be ordered by pitchNumber, then dateTime -->
            {#each results as result}
                <tr>
                    <td class="text-center text-muted info-col" style="width:20px">{result.tag}</td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td
                        on:click={() => {
                            $highlight = $highlight == result.homeTeam ? "" : result.homeTeam;
                        }}
                        class="text-right"
                        class:team-highlight={$highlight == result.homeTeam}>{result.homeTeam}</td
                    >

                    {#if homeScore(result) == ""}
                        <td colspan="2" class="text-center text-muted" style="width:40px">
                            {time(result.dateTime)}<br />pitch&nbsp;{result.pitch}
                        </td>
                    {:else}
                        <td class="text-right points" style="width:15px">{homeScore(result)}</td>
                        <td class="text-left points" style="width:15px">{awayScore(result)}</td>
                    {/if}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td
                        on:click={() => {
                            $highlight = $highlight == result.awayTeam ? "" : result.awayTeam;
                        }}
                        class="text-left"
                        class:team-highlight={$highlight == result.awayTeam}>{result.awayTeam}</td
                    >
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
