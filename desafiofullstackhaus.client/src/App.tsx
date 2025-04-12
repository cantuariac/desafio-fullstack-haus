import { useState, useEffect } from "react";
import { AppShell, Group, MantineProvider, TextInput, Title, Select, Stack, Button, Container, Grid, ScrollArea, Text, Card, Loader, Pill, Center } from "@mantine/core";
import { IconCalendar, IconPlus } from '@tabler/icons-react';
import "@mantine/core/styles.css";

import { theme } from "./theme";
import { HausAPI, PlanoAcao, StaticData } from "./models";

export default function App() {

    const [staticData, setStaticData] = useState<StaticData>();
    const [acoes, setAcoes] = useState<PlanoAcao>();

    const [queryValue, setQueryValue] = useState('');

    useEffect(() => {
        async function loadStatic() {
            const data = await HausAPI.fetchStaticData();
            setStaticData(data);
        }
        loadStatic();
    }, []);
    useEffect(() => {
        async function loadAcoes() {
            const data = await HausAPI.fetchAcoesData(queryValue);
            setAcoes(data);
        }
        loadAcoes();
    }, [queryValue]);

    return (
        <MantineProvider theme={theme}>
            <Container fluid={true}
                //style={{ width: '100%' }}
                bg='var(--mantine-color-blue-light)'>
                <AppShell w="1200px"
                    padding="md"
                    navbar={{
                        width: 80,
                        breakpoint: 'sm',
                    }}>

                    <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

                    <AppShell.Main>
                        <Stack>
                            <Group justify="space-between">
                                <Title order={3}>Plano de ação</Title>
                                <Button leftSection={<IconPlus size={20} />} >Nova ação</Button>
                            </Group>

                            <Group justify="space-between">
                                <TextInput
                                    placeholder="Buscar ação"
                                    value={queryValue}
                                    onChange={(event) => setQueryValue(event.currentTarget.value)} />
                                <Group>
                                    <Select
                                        placeholder="Data"
                                        data={['Das mais recentes para antigas', 'Das mais antigas para recentes']} />
                                    <Select
                                        placeholder="Hierarquia"
                                        data={staticData === undefined ? [] :
                                            Object.keys(staticData.hierarquias).map(
                                                (id) => ({ value: id, label: staticData.hierarquias[parseInt(id)] })
                                            )} />
                                </Group>
                            </Group>

                            <Board />

                        </Stack>
                    </AppShell.Main>
                </AppShell>
            </Container>
        </MantineProvider>
    );
    function dayMonth(date: Date) {
        return `${date.getDate()}/${date.getMonth()}`
    }
    function Board() {
        return ((acoes === undefined || staticData === undefined) ?
            <Center><Loader color="blue" /></Center> :
            <Grid justify="center" align="flex-start">
                <Grid.Col span={4}>
                    <Text>Aberto</Text>
                    <ScrollArea>
                        {acoes.abertos.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.id]}
                                descricao={acao.descricao}
                                responsavel={acao.responsavel}
                                prazoConclusao={dayMonth(acao.prazoConclusao)} />)}
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Text>Em progresso</Text>
                    <ScrollArea>
                        {acoes.emProgresso.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.id]}
                                descricao={acao.descricao}
                                responsavel={acao.responsavel}
                                prazoConclusao={dayMonth(acao.prazoConclusao)} />)}
                    </ScrollArea>
               </Grid.Col>
                <Grid.Col span={4}>
                    <Text>Concluído</Text>
                    <ScrollArea>
                        {acoes.concluido.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.id]}
                                descricao={acao.descricao}
                                responsavel={acao.responsavel}
                                prazoConclusao={dayMonth(acao.prazoConclusao)} />)}
                    </ScrollArea>
               </Grid.Col>
            </Grid>
        );
    }
    function AcaoCard({ hierarquia, descricao, responsavel, prazoConclusao }) {
        return (
            <Card>
                <Card.Section><Pill>{hierarquia}</Pill></Card.Section>
                <Card.Section><Text>{descricao}</Text></Card.Section>
                <Card.Section><Group justify="space-between">
                    <Text>{responsavel}</Text>
                    <Group><IconCalendar /><Text>{prazoConclusao}</Text></Group>
                </Group></Card.Section>
            </Card>
        );
    }
}