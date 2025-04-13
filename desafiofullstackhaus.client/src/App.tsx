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
    const [hierarquiaFilter, setHierarquiaFilter] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStatic() {
            const data = await HausAPI.fetchStaticData();
            setStaticData(data);
        }
        loadStatic();
    }, []);
    useEffect(() => {
        async function loadAcoes() {
            setLoading(true);
            let data = await HausAPI.fetchAcoesData(queryValue, hierarquiaFilter);
            if (data === undefined) {
                data = [];
            }

            const plano = new PlanoAcao();
            const today = new Date();
            for (let i = 0; i < data.length; i++) {
                if (data[i].status == 2) {
                    plano.concluido.push(data[i]);
                } else if (data[i].prazoConclusao < today) {
                    plano.atrasados.push(data[i]);
                } else if (data[i].status == 0) {
                    plano.abertos.push(data[i]);
                } else if (data[i].status == 1) {
                    plano.emProgresso.push(data[i]);
                }
            }
            setAcoes(plano);
            setLoading(false);
        }
        loadAcoes();
    }, [queryValue, hierarquiaFilter]);

    return (
        <MantineProvider theme={theme}>
            <Container fluid={true}
                bg='#F8F8F8'>
                <AppShell w="1280px" h="720px"
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
                                <Button variant="filled" radius="xl" leftSection={<IconPlus size={20} />} >Nova ação</Button>
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
                                            )}
                                        value={hierarquiaFilter}
                                        onChange={(event) => setHierarquiaFilter(event)} />
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
        return `${date.getDate()}/${date.getMonth() + 1}`
    }
    function Board() {
        return ((loading || acoes === undefined || staticData === undefined) ?
            <Center><Loader color="blue" /></Center> :
            <Grid justify="center" align="flex-start">
                <Grid.Col span={3}>
                    <Text bg='#F0F0F0B2'>Aberto {acoes.abertos.length}</Text>
                    <ScrollArea>
                        {acoes.abertos.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.hierarquiaId]}
                                descricao={acao.descricao}
                                responsavel={acao.responsavel}
                                prazoConclusao={dayMonth(acao.prazoConclusao)} />)}
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text bg='#F0F0F0B2'>Em progresso {acoes.emProgresso.length}</Text>
                    <ScrollArea>
                        {acoes.emProgresso.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.hierarquiaId]}
                                descricao={acao.descricao}
                                responsavel={acao.responsavel}
                                prazoConclusao={dayMonth(acao.prazoConclusao)} />)}
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text bg='#F0F0F0B2'>Concluído {acoes.concluido.length}</Text>
                    <ScrollArea>
                        {acoes.concluido.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.hierarquiaId]}
                                descricao={acao.descricao}
                                responsavel={acao.responsavel}
                                prazoConclusao={dayMonth(acao.prazoConclusao)} />)}
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text bg='#F0F0F0B2'>Atrasado {acoes.atrasados.length}</Text>
                    <ScrollArea>
                        {acoes.atrasados.map(acao =>
                            <AcaoCard
                                hierarquia={staticData.hierarquias[acao.hierarquiaId]}
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