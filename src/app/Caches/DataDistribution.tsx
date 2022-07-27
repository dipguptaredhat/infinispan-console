import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Level,
    LevelItem,
    Select,
    SelectOption,
    SelectVariant,
    Spinner,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
    ToolbarItemVariant,
} from '@patternfly/react-core';
import { Chart, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import { TableErrorState } from '@app/Common/TableErrorState';
import { useTranslation } from 'react-i18next';
import { useDataDistribution } from '@app/services/dataDistributionHook';
import { DataDistributionStatsOption } from "@services/infinispanRefData";
import { PopoverHelp } from '@app/Common/PopoverHelp';
import { TableComposable, TableVariant, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

const DataDistribution = (props: {
    cacheName: string;
}) => {
    const { t } = useTranslation();
    const brandname = t('brandname.brandname');

    const { dataDistribution, loading, error } = useDataDistribution(props.cacheName);

    const [isOpenStatsOptions, setIsOpenStatsOptions] = useState<boolean>(false);
    const [statsOption, setStatsOption] = useState<string>(DataDistributionStatsOption.Entries);

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
    });
    const [rows, setRows] = useState<DataDistribution[] | any>([]);

    useEffect(() => {
        if (dataDistribution) {
            const initSlice = (pagination.page - 1) * pagination.perPage;
            setRows(dataDistribution.slice(initSlice, initSlice + pagination.perPage));
        }
    }, [loading, dataDistribution, error, pagination]);

    const onSelectStatsOptions = (event, selection, isPlaceholder) => {
        setStatsOption(selection);
        setIsOpenStatsOptions(false);
    };

    const onSetPage = (_event, pageNumber) => {
        setPagination({
            page: pageNumber,
            perPage: pagination.perPage,
        });

        const initSlice = (pageNumber - 1) * pagination.perPage;
        setRows(
            dataDistribution?.slice(initSlice, initSlice + pagination.perPage)
        );
    };

    const onPerPageSelect = (_event, perPage) => {
        setPagination({
            page: 1,
            perPage: perPage,
        })

        const initSlice = (pagination.page - 1) * perPage;
        setRows(dataDistribution?.slice(initSlice, initSlice + perPage));
    };

    const buildCardContent = () => {
        if (loading && dataDistribution === undefined) {
            return (
                <Spinner size={'sm'} />
            );
        }

        if (error != '') {
            return (
                <TableErrorState error={error} />
            )
        }

        let size = 0

        const data = dataDistribution?.map((item) => {
            size++;
            const yaxis = statsOption === DataDistributionStatsOption.Entries ? item.total_entries : item.memory_entries;
            return { name: item.node_name, y: yaxis, x: item.node_name }
        });

        const distributionChart = (
            <div style={{ height: '450px', width: '700px', margin: "auto" }}>
                <Chart
                    ariaDesc={t('caches.cache-metrics.data-distribution')}
                    ariaTitle={t('caches.cache-metrics.data-distribution')}
                    containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
                    domain={{ y: [0, 9] }}
                    domainPadding={{ x: [30, 25] }}
                    legendData={[{ name: 'Total memory used' }, { name: 'Total memory used above/below threshold' }]}
                    legendOrientation="horizontal"
                    legendPosition="bottom"
                    height={350}
                    padding={{
                        bottom: 50,
                        left: 200, // Adjusted to accommodate y axis label
                        right: 100, // Adjusted to accommodate legend
                        top: 50
                    }}
                    width={700}
                >
                    <ChartGroup offset={11} horizontal>
                        <ChartBar data={data} />
                    </ChartGroup>
                </Chart>
            </div>
        )

        const columnNames = {
            nodeName: t('caches.cache-metrics.data-distribution-node-name'),
            entries: t('caches.cache-metrics.data-distribution-option-entries'),
            entryInMemory: t('caches.cache-metrics.data-distribution-option-entries-in-memory'),
            memory: t('caches.cache-metrics.data-distribution-option-memory')
        };

        const distributionTable = (
            <div>
                <Toolbar id="distribution-table-toolbar">
                    <ToolbarContent>
                        <ToolbarItem variant={ToolbarItemVariant.pagination}>
                            <Pagination
                                itemCount={size}
                                perPage={pagination.perPage}
                                page={pagination.page}
                                onSetPage={onSetPage}
                                widgetId="distribution-table-pagination"
                                onPerPageSelect={onPerPageSelect}
                                isCompact
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
                <TableComposable
                    aria-label="Data Distribution Table"
                    variant={TableVariant.compact}
                    borders
                >
                    <Thead>
                        <Tr>
                            <Th>{columnNames.nodeName}</Th>
                            <Th>{columnNames.entries}</Th>
                            <Th>{columnNames.memory}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {rows.map(row => (
                            <Tr key={row.node_name}>
                                <Td dataLabel={columnNames.nodeName}>{row.node_name}</Td>
                                <Td dataLabel={columnNames.entries}>{row.total_entries}</Td>
                                <Td dataLabel={columnNames.memory}>{row.memory_entries}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </TableComposable>
            </div>
        )

        return size <= 5 ? distributionChart : distributionTable;
    };

    const buildStatsOption = () => {
        return (
            <Select
                variant={SelectVariant.single}
                aria-label="stats-select"
                onToggle={() => setIsOpenStatsOptions(!isOpenStatsOptions)}
                onSelect={onSelectStatsOptions}
                selections={statsOption}
                isOpen={isOpenStatsOptions}
                aria-labelledby="toggle-id-stats"
                toggleId="statsSelect"
                width={200}
                position="right"
            >
                <SelectOption key={0} value={t('caches.cache-metrics.data-distribution-option-entries')} />
                <SelectOption key={1} value={t('caches.cache-metrics.data-distribution-option-entries-in-memory')} isDisabled />
                <SelectOption key={2} value={t('caches.cache-metrics.data-distribution-option-memory')} />
            </Select>
        );
    }

    return (
        <Card>
            <CardTitle>
                <Level id={'data-node-stats'}>
                    <LevelItem>
                        <PopoverHelp
                            name='data-node-stats'
                            label={t('caches.cache-metrics.data-distribution-title')}
                            content={t('caches.cache-metrics.data-distribution-tooltip')}
                            text={t('caches.cache-metrics.data-distribution-title')}
                        />
                    </LevelItem>
                    {dataDistribution?.length <= 5 && buildStatsOption()}
                </Level>
            </CardTitle>
            <CardBody>{buildCardContent()}</CardBody>
        </Card>
    );
};

export { DataDistribution };
