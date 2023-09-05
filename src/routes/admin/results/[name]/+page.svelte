<script>
    import { onMount } from "svelte";
    import Button from "@smui/button";
    import Paper, { Title, Content } from "@smui/paper";
    import Tab, { Label } from "@smui/tab";
    import TabBar from "@smui/tab-bar";
    import LayoutGrid, { Cell as GridCell } from "@smui/layout-grid";
    import DataTable, { Body, Row, Cell } from "@smui/data-table";
    import Select, { Option } from "@smui/select";
    import Checkbox from "@smui/checkbox";
    import FormField from "@smui/form-field";
    import IconButton, { Icon } from "@smui/icon-button";
    import { mdiPlusBox, mdiMinusBox, mdiCheck, mdiCancel, mdiAlarm, mdiAlarmOff } from "@mdi/js";
    import leaguesort from "@sports-club-manager/leaguesort";

    import { goto } from "$app/navigation";

    import "$lib/global.scss";
    import { io } from "$lib/socket-client";
    import { awayScore, homeScore, dateTimeSort, time } from "$lib/collections.js";
    import LeagueTable from "$lib/components/LeagueTable.svelte";
    import Section from "$lib/components/Section.svelte";

    export let data;

    let { tournament, results, selectedName } = data;
    let showCompleted = false;
    let selectedDay;
    let active = "results";
    let groupTables;

    let days = [...new Set(results.map((r) => r.day))];
    let competitions = tournament.competitions.reduce(
        (comps, comp) => (comps.find((x) => x.name === comp.name) ? [...comps] : [...comps, comp]),
        []
    );

    const score = (result, inc, home) => {
        // mark the result as being edited to prevent socket updates causing it to be hidden
        result.editing = true;

        let goal = inc ? 1 : -1;
        if (home) {
            if (result.pens) {
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
            if (result.pens) {
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

    const confirmTable = (results) => {
        let comp = results[0].competition;
        let entries = leaguesort.calculateTable(results);
        entries = entries.map((e) => e.name).reduce((acc, val) => acc.concat(val), []);
        fetch(`/api/leaguetable/${comp.name}/${comp.section.replaceAll(" ", "")}/${comp.group}`, { method: "POST", body: JSON.stringify(entries) });
    };

    $: competitionResults = results.filter((r) => r.competition.name == selectedName);

    $: displayedResults = competitionResults
        .filter((r) => (showCompleted || r.homeGoals == undefined || r._v == 0 || r.editing) && r.day == (selectedDay || r.day))
        .sort(dateTimeSort);

    $: {
        groupTables = {};
        for (let i = 0; i < competitionResults.length; i++) {
            if (competitionResults[i].competition.group != undefined) {
                let c = competitionResults[i].competition;
                let key = c.section.replaceAll(" ", "") + c.group;
                if (groupTables[key] == undefined) groupTables[key] = [];
                groupTables[key].push(competitionResults[i]);
            }
        }
    }

    // ----------------------------------------------------------------------

    onMount(() => {
        io.on("save-result", (result) => {
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == result._id) {
                    results[i] = result;
                    break;
                }
            }
        });

        io.on("remove-result", (resultId) => {
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == resultId) {
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
        <Paper color="primary" variant="outlined">
            <Content>
                <Icon style="padding: 1em;" class="material-icons">filter_alt</Icon>

                <Select bind:value={selectedDay} label="Day" style="width: 100px">
                    <Option>Any</Option>
                    {#each days as day}
                        <Option value={day}>Day {day}</Option>
                    {/each}
                </Select>
                <Select bind:value={selectedName} label="Competition" style="width: 150px">
                    {#each competitions as comp}
                        <Option on:SMUI:action={() => goto(`/admin/results/${comp.name}`)} value={comp.name}>{comp.name}</Option>
                    {/each}
                </Select>
                <FormField align="end">
                    <Checkbox bind:checked={showCompleted} />
                    <span slot="label">Show Completed</span>
                </FormField>
            </Content>
        </Paper>

        <TabBar tabs={["results", "tables"]} let:tab bind:active>
            <Tab {tab} minWidth>
                <Label>{tab}</Label>
            </Tab>
        </TabBar>

        {#if active === "results"}
            <DataTable table$aria-label="Result list" style="width: 100%;">
                <Body>
                    {#each displayedResults as result}
                        <Row>
                            <Cell style="width: 10%;">
                                <small>
                                    {result.competition.section || ""}<br />
                                    {#if result.competition.group}
                                        Grp {result.competition.group} / #
                                    {/if}
                                    {result.tag}
                                </small>
                            </Cell>
                            <Cell numeric style="width: 32%;">
                                {result.homeTeam}
                                <IconButton
                                    class="material-icons"
                                    on:click={() => (result = score(result, false, true))}
                                    size="button"
                                >
                                    <Icon tag="svg" viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiMinusBox} />
                                    </Icon>
                                </IconButton>
                                <IconButton
                                    class="material-icons"
                                    on:click={() => (result = score(result, true, true))}
                                    size="button"
                                >
                                    <Icon tag="svg" viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiPlusBox} />
                                    </Icon>
                                </IconButton>
                            </Cell>
                            <Cell numeric class="points" style="width: 6%;">
                                {#if homeScore(result) == ""}<small>P{result.pitch}</small> {:else}{homeScore(result)}{/if}
                            </Cell>
                            <Cell class="points" style="width: 6%;">
                                {#if awayScore(result) == ""}<small>{time(result.dateTime)}</small> {:else}{awayScore(result)}{/if}
                            </Cell>
                            <Cell style="width: 32%;">
                                <IconButton
                                    class="material-icons"
                                    on:click={() => (result = score(result, true, false))}
                                    size="button"
                                >
                                    <Icon tag="svg" viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiPlusBox} />
                                    </Icon>
                                </IconButton>
                                <IconButton
                                    class="material-icons"
                                    on:click={() => (result = score(result, false, false))}
                                    size="button"
                                >
                                    <Icon tag="svg" viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiMinusBox} />
                                    </Icon>
                                </IconButton>
                                {result.awayTeam}
                            </Cell>
                            <Cell>
                                {#if result.homeGoals !== undefined}
                                    <IconButton
                                        class="material-icons"
                                        on:click={() => (result.pens = !result.pens)}
                                        size="button"
                                        disabled={result.homeGoals != result.awayGoals || result.competition.group != undefined}
                                    >
                                        <Icon tag="svg" viewBox="0 0 24 24">
                                            <path fill="currentColor" d={result.pens ? mdiAlarm : mdiAlarmOff} />
                                        </Icon>
                                    </IconButton>
                                    <IconButton class="material-icons" on:click={() => updateResult(result)} size="button">
                                        <Icon tag="svg" viewBox="0 0 24 24">
                                            <path fill="currentColor" d={mdiCheck} />
                                        </Icon>
                                    </IconButton>
                                    <IconButton class="material-icons" on:click={() => resetResult(result)} size="button">
                                        <Icon tag="svg" viewBox="0 0 24 24">
                                            <path fill="currentColor" d={mdiCancel} />
                                        </Icon>
                                    </IconButton>
                                {/if}
                            </Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
        {:else if active === "tables"}
            <LayoutGrid>
                {#each Object.keys(groupTables) as table}
                    <GridCell spanDevices={{ desktop: 6, tablet: 12, phone: 12 }}>
                        <div class="header">
                            <Button variant="raised" on:click={() => confirmTable(groupTables[table])}>
                                <Label>Confirm Final Positions</Label>
                            </Button>
                            {groupTables[table][0].competition.section} / G{groupTables[table][0].competition.group}
                        </div>
                        <LeagueTable bind:results={groupTables[table]} />
                    </GridCell>
                {/each}
            </LayoutGrid>
        {/if}
    </div>
</Section>

<style>
    div.header {
        font-size: 1.1em;
        border-bottom: 1px solid;
        padding: 4px;
    }
</style>
