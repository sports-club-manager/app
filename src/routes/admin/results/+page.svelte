<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
    import Select, { Option } from "@smui/select";
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';
    import Button from "@smui/button";

    import { io } from "$lib/socket-client";
    import Section from "$lib/components/Section.svelte";
    import { dateTimeSort, saveRemoveResults, time } from "$lib/collections.js";

    export let data;
    let { tournament, results } = data;

    let selectedName = "U11", showCompleted = false, selectedDay;

    let competitions = tournament.competitions.reduce(
        (comps, comp) => (comps.find((x) => x.name === comp.name) ? [...comps] : [...comps, comp]),
        []
    );

    let days = [...new Set(results.map(res => res.day))];

    results.sort(dateTimeSort);

    $: filteredResults = results.filter(
        (r) => (
            r.competition.name == selectedName &&
            (showCompleted || (r.homeGoals == undefined && r.awayGoals == undefined)) &&
            r.day == (selectedDay || r.day)
        )
    );
    // ----------------------------------------------------------------------

    onMount(() => {
        io.on("save-result", (result) => {
            console.debug("Received result", result);
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == result._id) {
                    console.debug(`Found result to update: ${i}`);
                    results[i] = result;
                    break;
                }
            }
        });

        io.on("remove-result", (resultId) => {
            console.debug("Result deleted", resultId);
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == resultId) {
                    console.debug(`Found result to remove: ${i}`);
                    results.splice(i, 1);
                    break;
                }
            }
        });
    });

</script>

<svelte:head>
    <title>{selectedName || ""} Results Entry</title>
</svelte:head>

<Section fab="icon:edit" container={false}>
    <div slot="section-head">
        <h4>{selectedName || ""} Results Entry</h4>
    </div>

    <div slot="section-body">
        <div>                
            <Select bind:value={selectedDay} label="Day" style="width: 100px">
                <Option>Any</Option>
                {#each days as day}
                    <Option value={day}>Day {day}</Option>
                {/each}
            </Select>
            <Select bind:value={selectedName} label="Competition" style="width: 150px">
                {#each competitions as comp}
                    <Option value={comp.name}>{comp.name}</Option>
                {/each}
            </Select> 
            <FormField align="end">
                <Checkbox bind:checked={showCompleted} />
                <span slot="label">Show Completed</span>
            </FormField>
        </div>
        <DataTable stickyHeader table$aria-label="Result list" style="width: 100%;">
            <Head>
                <Row>
                    <Cell style="width: 30%">Competition</Cell>
                    <Cell numeric>Home</Cell>
                    <Cell></Cell>
                    <Cell></Cell>
                    <Cell>Away</Cell>
                </Row>
            </Head>
            <Body>
                {#each filteredResults as result}
                    <Row>
                        <Cell>
                            {result.competition.name}
                            {result.competition.section || ""}
                            {#if result.competition.group}
                                G{result.competition.group}
                            {/if} /
                            Game {result.tag}<br/>
                            Pitch {result.pitch} at
                            {time(result.dateTime)}
                        </Cell>
                        <Cell numeric>{result.homeTeam}</Cell>
                        <Cell numeric>{result.homeGoals || 0}</Cell>
                        <Cell>{result.awayGoals || 0}</Cell>
                        <Cell>{result.awayTeam}</Cell>
                    </Row>
                {/each}
            </Body>
        </DataTable>
    </div>
</Section>
