<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import DataTable, { Body, Row, Cell } from "@smui/data-table";
    import Select, { Option } from "@smui/select";
    import Checkbox from "@smui/checkbox";
    import FormField from "@smui/form-field";
    import IconButton, { Icon } from "@smui/icon-button";
    import { Svg } from "@smui/common";
    import { mdiPlusBox, mdiMinusBox, mdiCheck, mdiCancel } from "@mdi/js";

    import { io } from "$lib/socket-client";
    import Section from "$lib/components/Section.svelte";
    import { dateTimeSort, time } from "$lib/collections.js";

    export let data;

    let { tournament, results } = data;
    let selectedName;
    let showCompleted = false;
    let selectedDay;

    let days = [...new Set(results.map((res) => res.day))];
    let competitions = tournament.competitions.reduce(
        (comps, comp) => (comps.find((x) => x.name === comp.name) ? [...comps] : [...comps, comp]),
        []
    );

    const score = (result, inc, home, penalty) => {
        let goal = inc ? 1 : -1;
        if (home) {
            if (penalty) {
                if (result.homePens == undefined) {
                    result.homePens = 1;
                    result.awayPens = 0;
                } else {
                    result.homePens = result.homePens + goal;
                }
            } else {
                if (result.homeGoals == undefined) {
                    result.homeGoals = goal;
                    result.awayGoals = 0;
                } else {
                    result.homeGoals = result.homeGoals + goal;
                }
            }
        } else {
            if (penalty) {
                if (result.awayPens == undefined) {
                    result.awayPens = 1;
                    result.homePens = 0;
                } else {
                    result.awayPens = result.awayPens + goal;
                }
            } else {
                if (result.awayGoals == undefined) {
                    result.awayGoals = goal;
                    result.homeGoals = 0;
                } else {
                    result.awayGoals = result.awayGoals + goal;
                }
            }
        }

        if (result.homeGoals < 0) result.homeGoals = 0;
        if (result.homePens < 0) result.homePens = 0;
        if (result.awayGoals < 0) result.awayGoals = 0;
        if (result.awayPens < 0) result.awayPens = 0;

        return result;
    };

    const updateResult = (result) => {
        fetch(`/api/results/${result._id}`, { method: "PUT", body: JSON.stringify(result) });
    };

    const resetResult = (result) => {
        result.homeGoals = undefined;
        result.awayGoals = undefined;
        result.homePens = undefined;
        result.awayPens = undefined;
        fetch(`/api/results/${result._id}`, { method: "PUT", body: JSON.stringify(result) });
    };

    results.sort(dateTimeSort);

    $: filteredResults = results.filter(
        (r) =>
            r.competition.name == selectedName &&
            (showCompleted || r.homeGoals == undefined || r._v == 0) &&
            r.day == (selectedDay || r.day)
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
            <Icon style="padding: 1em;" class="material-icons">filter_alt</Icon>
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
        <DataTable table$aria-label="Result list" style="width: 100%;">
            <Body>
                {#each filteredResults as result}
                    <Row>
                        <Cell>
                            <small>
                                {result.competition.section || ""}<br>
                                {#if result.competition.group}
                                    Grp {result.competition.group} / Game
                                {/if} {result.tag}
                            </small>
                        </Cell>
                        <Cell numeric style="width: 32%;">
                            {result.homeTeam}
                            <IconButton
                                class="material-icons"
                                on:click={() => (result = score(result, false, true, false))}
                                size="button"
                            >
                                <Icon component={Svg} viewBox="0 0 24 24">
                                    <path fill="currentColor" d={mdiMinusBox} />
                                </Icon>
                            </IconButton>
                            <IconButton
                                class="material-icons"
                                on:click={() => (result = score(result, true, true, false))}
                                size="button"
                            >
                                <Icon component={Svg} viewBox="0 0 24 24">
                                    <path fill="currentColor" d={mdiPlusBox} />
                                </Icon>
                            </IconButton>
                        </Cell>
                        <Cell numeric class="points" style="width: 6%;">
                            {#if result.homeGoals == undefined}<small>P{result.pitch}</small> {:else}{result.homeGoals}{/if}
                        </Cell>
                        <Cell class="points" style="width: 6%;">
                            {#if result.awayGoals == undefined}<small>{time(result.dateTime)}</small> {:else}{result.awayGoals}{/if}
                        </Cell>
                        <Cell style="width: 32%;">
                            <IconButton
                                class="material-icons"
                                on:click={() => (result = score(result, true, false, false))}
                                size="button"
                            >
                                <Icon component={Svg} viewBox="0 0 24 24">
                                    <path fill="currentColor" d={mdiPlusBox} />
                                </Icon>
                            </IconButton>
                            <IconButton
                                class="material-icons"
                                on:click={() => (result = score(result, false, false, false))}
                                size="button"
                            >
                                <Icon component={Svg} viewBox="0 0 24 24">
                                    <path fill="currentColor" d={mdiMinusBox} />
                                </Icon>
                            </IconButton>
                            {result.awayTeam}
                        </Cell>
                        <Cell>
                            {#if result.homeGoals !== undefined}
                                <IconButton class="material-icons" on:click={() => updateResult(result)} size="button">
                                    <Icon component={Svg} viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiCheck} />
                                    </Icon>
                                </IconButton>
                                <IconButton class="material-icons" on:click={() => resetResult(result)} size="button">
                                    <Icon component={Svg} viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiCancel} />
                                    </Icon>
                                </IconButton>
                            {/if}
                        </Cell>
                    </Row>
                {/each}
            </Body>
        </DataTable>
    </div>
</Section>
