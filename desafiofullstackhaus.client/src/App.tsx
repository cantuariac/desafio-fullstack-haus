import { useState, useEffect } from "react";
import {
    AppShell, Group, MantineProvider, TextInput, Title, Select, Stack, Button,
    Container, Grid, ScrollArea, Text, Card, Loader, Pill, Center, Modal,
    Checkbox
} from "@mantine/core";
import { DateInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarWeek, IconPlus } from '@tabler/icons-react';
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';

import { theme } from "./theme";
import { Acao, HausAPI, PlanoAcao, StaticData, StatusAcao } from "./models";

export default function App() {

    const [staticData, setStaticData] = useState<StaticData>();
    const [acoes, setAcoes] = useState<PlanoAcao>();

    const [queryValue, setQueryValue] = useState('');
    const [hierarquiaFilter, setHierarquiaFilter] = useState();
    const [loading, setLoading] = useState(true);

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        async function loadStatic() {
            const data = await HausAPI.fetchStaticData();
            setStaticData(data);
        }
        loadStatic();
    }, []);

    useEffect(() => {
        loadAcoes();
    }, [queryValue, hierarquiaFilter]);

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

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: null,
            descricao: '',
            responsavel: '',
            prazoConclusao: (new Date()).toISOString(),
            hierarquiaId: 0,
            status: 0,
            causas: [],
        },

        transformValues: (values) => ({
            ...values,
            hierarquiaId: Number(values.hierarquiaId),
            status: Number(values.status),
            causas: values.causas.map((c) => Number(c))
        }),

        validate: {
            descricao: (value: string) => value == '' ? "O campo descrição é obrigatório" : null,
            responsavel: (value) => value == '' ? "O campo responsável é obrigatório" : null,
            //prazoConclusao: (value) => value == '' ? "A data de conclusão é obrigatória" : null,
            hierarquiaId: (value) => value == null ? "O hierarquia de controle é obrigatório" : null,
            causas: (value) => value.length < 1 ? "A ação dever ter ao menos uma causa" : null,
        },
    });

    return (
        <MantineProvider theme={theme}>
            <Container fluid={true}
                bg='#F8F8F8'>
                <AppShell
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
                                <Button variant="filled" radius="xl"
                                    leftSection={<IconPlus size={20} />}
                                    onClick={(event) => {
                                        form.setValues({
                                            id: null,
                                            descricao: '',
                                            responsavel: '',
                                            prazoConclusao: (new Date()).toISOString(),
                                            hierarquiaId: undefined,
                                            status: '0',
                                            causas: [],
                                        });
                                        open();
                                    }}>
                                    Nova ação
                                </Button>
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

                            <AcaoForm />

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
                    <Text size="xl" bg='#F0F0F0B2'>Aberto {acoes.abertos.length}</Text>
                    <ScrollArea>
                        <Stack>
                            {acoes.abertos.map(acao => <AcaoCard acao={acao} />)}
                        </Stack>
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text size="xl" bg='#F0F0F0B2'>Em progresso {acoes.emProgresso.length}</Text>
                    <ScrollArea>
                        <Stack>
                            {acoes.emProgresso.map(acao => <AcaoCard acao={acao} />)}
                        </Stack>
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text size="xl" bg='#F0F0F0B2'>Concluído {acoes.concluido.length}</Text>
                    <ScrollArea>
                        <Stack>
                            {acoes.concluido.map(acao => <AcaoCard acao={acao} />)}
                        </Stack>
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text size="xl" bg='#F0F0F0B2'>Atrasado {acoes.atrasados.length}</Text>
                    <ScrollArea>
                        <Stack>
                            {acoes.atrasados.map(acao => <AcaoCard acao={acao} />)}
                        </Stack>
                    </ScrollArea>
                </Grid.Col>
            </Grid>
        );
    }
    function AcaoCard({ acao }: { acao: Acao }) {
        return (staticData === undefined ? <></> :
            <Card padding="sm" radius="lg"
                onClick={(event) => {
                    form.setValues({
                        ...acao,
                        prazoConclusao: acao.prazoConclusao.toISOString(),
                        hierarquiaId: acao.hierarquiaId.toString(),
                        status: acao.status.toString(),
                        causas: acao.causas.map((id) => id.toString()),
                    });
                    open();
                }}>
                <Card.Section><Pill bg="blue">{staticData.hierarquias[acao.hierarquiaId]}</Pill></Card.Section>
                <Card.Section><Text>{acao.descricao}</Text></Card.Section>
                <Card.Section><Group justify="space-between">
                    <Text>{acao.responsavel}</Text>
                    <Group><IconCalendarWeek /><Text>{dayMonth(acao.prazoConclusao)}</Text></Group>
                </Group></Card.Section>
            </Card>
        );
    }
    function AcaoForm() {
        return (staticData === undefined ? <></> :
            <>
                <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
                    <form onSubmit={form.onSubmit(async (values) => {
                        console.log(JSON.stringify(values));
                        if (values.id == null) {
                            delete values.id;
                            await HausAPI.createAcao(values);
                        }
                        else {
                            await HausAPI.updateAcao(values.id, values);
                        }
                        close();
                        loadAcoes();
                    })}>
                        <Group justify="space-between">
                            <Title order={2}>Ação</Title>
                            <Group justify="flex-end" mt="md">
                                <Button type="button" radius="xl" onClick={close}>Cancelar</Button>
                                <Button type="submit" radius="xl">Salvar</Button>
                            </Group>
                        </Group>

                        <Grid justify="center" align="flex-start">
                            <Grid.Col span={6}>
                                <Checkbox.Group
                                    label="Vincular causas para essa ação"
                                    withAsterisk
                                    key={form.key('causas')}
                                    {...form.getInputProps('causas')}
                                >
                                    <Stack mt="xs">
                                        {Object.keys(staticData.causas).map((id) =>
                                            <Checkbox value={id} label={staticData.causas[parseInt(id)]} />)}
                                    </Stack>
                                </Checkbox.Group>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Stack>
                                    <TextInput
                                        withAsterisk
                                        label="Descrição"
                                        placeholder="Digite aqui a descrição da ação"
                                        key={form.key('descricao')}
                                        {...form.getInputProps('descricao')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Responsável"
                                        placeholder="Digite o nome completo"
                                        key={form.key('responsavel')}
                                        {...form.getInputProps('responsavel')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Data de conclusão"
                                        key={form.key('prazoConclusao')}
                                        {...form.getInputProps('prazoConclusao')}
                                    />
                                    {/*<DateTimePicker */}
                                    {/*    withAsterisk*/}
                                    {/*    label="Data de conclusão"*/}
                                    {/*    key={form.key('prazoConclusao')}*/}
                                    {/*    {...form.getInputProps('prazoConclusao')}*/}
                                    {/*/>*/}
                                    <Select
                                        withAsterisk
                                        label="Hierarquia de controle"
                                        data={Object.keys(staticData.hierarquias).map(
                                            (id) => ({ value: id, label: staticData.hierarquias[parseInt(id)] })
                                        )}
                                        key={form.key('hierarquiaId')}
                                        {...form.getInputProps('hierarquiaId')} />
                                    <Select
                                        withAsterisk
                                        label="Status"
                                        data={[
                                            { value: "0", label: "Aberta" },
                                            { value: "1", label: "Em Progresso" },
                                            { value: "2", label: "Concluída" }
                                        ]}
                                        allowDeselect={false}
                                        key={form.key('status')}
                                        {...form.getInputProps('status')} />
                                </Stack>
                            </Grid.Col>
                        </Grid >
                    </form>
                </Modal>
            </>
        );
    }
}