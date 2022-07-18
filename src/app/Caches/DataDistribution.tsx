import React, { useState } from 'react';
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
} from '@patternfly/react-core';
import { Chart, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import { TableErrorState } from '@app/Common/TableErrorState';
import { useTranslation } from 'react-i18next';
import { CustomCardTitle } from "@app/Common/CustomCardTitle";
import { useDataDistribution } from '@app/services/dataDistributionHook';

const DataDistribution = (props: {
    cacheName: string;
}) => {
    const { t } = useTranslation();
    const brandname = t('brandname.brandname');

    const [isOpenStatsOptions, setIsOpenStatsOptions] = useState<boolean>(false);
    const [statsOption, setStatsOption] = useState<string>("Total number of entries");

    const { dataDistribution, loading, error } = useDataDistribution()

    const onSelectStatsOptions = (event, selection, isPlaceholder) => {
        setStatsOption(selection);
        setIsOpenStatsOptions(false);
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

        const data = dataDistribution?.map((item) => {
            const yaxis = statsOption === "Total number of entries" ? item.total_entries : item.memory_entries;
            return { name: item.node_name, y: yaxis, x: item.node_name }
        }
        );

        return (
            <div style={{ height: '450px', width: '700px', margin: "auto" }}>
                <Chart
                    ariaDesc="Average number of pets"
                    ariaTitle="Bar chart example"
                    containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
                    domain={{ y: [0, 9] }}
                    domainPadding={{ x: [30, 25] }}
                    legendData={[{ name: 'Total memory used' }, { name: 'Total memory used above/below threshold' }]}
                    legendOrientation="horizontal"
                    legendPosition="bottom"
                    height={350}
                    padding={{
                        bottom: 50,
                        left: 50,
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
        );
    };

    const buildStatsOption = () => {
        return (
            <Select
                variant={SelectVariant.single}
                aria-label="storage-select"
                onToggle={() => setIsOpenStatsOptions(!isOpenStatsOptions)}
                onSelect={onSelectStatsOptions}
                selections={statsOption}
                isOpen={isOpenStatsOptions}
                aria-labelledby="toggle-id-storage"
                toggleId="storageSelector"
                width={200}
                position="right"
            >
                <SelectOption key={0} value={"Total number of entries"} />
                <SelectOption key={1} value={"Total number of entries in memory"} isDisabled />
                <SelectOption key={2} value={"Total memory used"} />
            </Select>
        );
    }

    return (
        <Card>
            <CardTitle>
                <Level id={'data-node-stats'}>
                    <LevelItem>
                        <CustomCardTitle
                            title={'Data for nodes'}
                            toolTip={'Data for nodes tooltip'}
                        />
                    </LevelItem>
                    {buildStatsOption()}
                </Level>
            </CardTitle>
            <CardBody>{buildCardContent()}</CardBody>
        </Card>
    );
};

export { DataDistribution };
