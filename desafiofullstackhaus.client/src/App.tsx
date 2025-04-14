import { useState, useEffect } from "react";
import {
    AppShell, Group, MantineProvider, TextInput, Title, Select, Stack, Button,
    Container, Grid, ScrollArea, Text, Card, Loader, Pill, Center, Modal,
    Checkbox
} from "@mantine/core";
import { DateInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from "@mantine/hooks";
import { IconCalendar, IconPlus } from '@tabler/icons-react';
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';

import { theme } from "./theme";
import { HausAPI, PlanoAcao, StaticData, StatusAcao } from "./models";

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
                                <Button variant="filled" radius="xl" leftSection={<IconPlus size={20} />} onClick={open}>Nova ação</Button>
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
            <Card padding="sm" radius="sm">
                <Card.Section><Pill>{hierarquia}</Pill></Card.Section>
                <Card.Section><Text>{descricao}</Text></Card.Section>
                <Card.Section><Group justify="space-between">
                    <Text>{responsavel}</Text>
                    <Group><IconCalendar /><Text>{prazoConclusao}</Text></Group>
                </Group></Card.Section>
            </Card>
        );
    }
    function AcaoForm() {
        const form = useForm({
            mode: 'uncontrolled',
            initialValues: {
                descricao: '',
                responsavel: '',
                prazoConclusao: (new Date()).toISOString(),
                hierarquiaId: null,
                status: 0,
                causas: [],
            },

            transformValues: (values) => ({
                ...values,
                hierarquiaId: Number(values.hierarquiaId),
                status: Number(StatusAcao[values.status])
            }),

            validate: {
                descricao: (value: string) => value == '' ? "O campo descrição é obrigatório" : null,
                responsavel: (value) => value == '' ? "O campo responsável é obrigatório" : null,
                //prazoConclusao: (value) => value == '' ? "A data de conclusão é obrigatória" : null,
                hierarquiaId: (value) => value == null ? "O hierarquia de controle é obrigatório" : null,
                causas: (value) => value.length < 1 ? "A ação dever ter ao menos uma causa" : null,
            },
        });
        return (staticData === undefined ? <></> :
            <>
                <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
                    <form onSubmit={form.onSubmit(async (values) => {
                        console.log(values);
                        const [ok, data] = await HausAPI.createAcao(values);
                        if (ok) { close(); }
                        else { alert(data); }
                    })}>
                        <Group justify="space-between">
                            <Title order={2}>Ação</Title>
                            <Group justify="flex-end" mt="md">
                                <Button type="button" radius="xl" onClick={close}>Cancelar</Button>
                                <Button type="submit" radius="xl">Salvar</Button>
                            </Group>
                        </Group>
                        {/*<Group justify="space-evenly" align="start">*/}

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
                                        defaultValue={"1"}
                                        allowDeselect={false}
                                        key={form.key('status')}
                                        {...form.getInputProps('status')} />
                                </Stack>
                            </Grid.Col>
                        </Grid >
                        {/*</Group>*/}
                    </form>
                </Modal>
            </>
        );
    }
}