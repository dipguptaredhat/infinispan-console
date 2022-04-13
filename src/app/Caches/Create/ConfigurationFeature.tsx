import React, { useState, useEffect } from 'react';
import {
    Divider,
    Form,
    FormGroup,
    Grid,
    GridItem,
    InputGroup,
    Text,
    TextContent,
    TextVariants,
    TextInput,
    Select,
    SelectOption,
    SelectVariant,
} from '@patternfly/react-core';
import { CacheFeature, MaxSizeUnit, EvictionStrategy } from "@services/infinispanRefData";
import { useTranslation } from 'react-i18next';
import { MoreInfoTooltip } from '@app/Common/MoreInfoTooltip';

const ConfigurationFeature = (props: {
    cacheFeature: CacheFeatureStep,
    cacheFeatureModifier: (CacheFeatureStep) => void,
    handleIsFormValid: (isFormValid: boolean) => void
}) => {

    const { t } = useTranslation();

    const [cacheFeatureSelected, setCacheFeatureSelected] = useState(props.cacheFeature.cacheFeatureSelected);

    //Bounded Cache
    const [maxSize, setMaxSize] = useState<string | undefined>(props.cacheFeature.maxSize);
    const [maxCount, setMaxCount] = useState<string | undefined>(props.cacheFeature.maxCount);
    const [evictionStrategy, setEvictionStrategy] = useState<string>(props.cacheFeature.evictionStrategy);

    const [isOpenCacheFeature, setIsOpenCacheFeature] = useState(false);
    const [isOpenEvictionStrategy, setIsOpenEvictionStrategy] = useState(false);
    const [isOpenMaxSizeUnit, setIsOpenMaxSizeUnit] = useState(false);

    // Helper states for the maxSize input
    const [maxSizeNumber, setMaxSizeNumber] = useState<string>();
    const [maxSizeUnit, setMaxSizeUnit] = useState<MaxSizeUnit>(MaxSizeUnit.MB);

    useEffect(() => {
        if (maxSize) {
            // Splitting the maxSize string into number and unit
            const [num, unit] = maxSize.match(/\D+|\d+/g);
            setMaxSizeNumber(num);
            setMaxSizeUnit(MaxSizeUnit[unit]);
        }
    }, [])

    useEffect(() => {
        if (maxSizeNumber) {
            setMaxSize(maxSizeNumber + maxSizeUnit);
        }
        if (maxSizeNumber === '') {
            setMaxSize(undefined);
            setMaxSizeNumber(undefined);
        }
        if (maxCount === '') setMaxCount(undefined);
    }, [maxSizeNumber, maxSizeUnit, maxCount])

    useEffect(() => {
        props.cacheFeatureModifier({
            cacheFeatureSelected: cacheFeatureSelected,
            maxSize: maxSize,
            maxCount: maxCount,
            evictionStrategy: evictionStrategy,
        });

        if (maxSizeNumber || maxCount)
            props.handleIsFormValid(parseInt(maxSizeNumber) >= 0 || parseInt(maxCount) >= 0);
        else if (cacheFeatureSelected.length < 1)
            props.handleIsFormValid(true);
        else
            props.handleIsFormValid(false);

    }, [cacheFeatureSelected, maxSize, maxCount, evictionStrategy]);

    const onSelect = (event, selection) => {
        if (cacheFeatureSelected.includes(selection)) {
            setCacheFeatureSelected(cacheFeatureSelected.filter(item => item !== selection));
        } else {
            setCacheFeatureSelected([...cacheFeatureSelected, selection]);
        }
    };

    const clearSelection = () => {
        setCacheFeatureSelected([]);
        setIsOpenCacheFeature(false);
    };

    const onSelectEvictionStrategy = (event, selection, isPlaceholder) => {
        setEvictionStrategy(selection);
        setIsOpenEvictionStrategy(false);
    };

    const onSelectMaxCountUnit = (event, selection, isPlaceholder) => {
        setMaxSizeUnit(selection);
        setIsOpenMaxSizeUnit(false);
    };

    const cacheFeatureOptions = () => {
        return Object.keys(CacheFeature).map((key) => (
            <SelectOption key={key} value={CacheFeature[key]} isDisabled={key !== 'BOUNDED'} />
        ));
    };

    const formCacheFeatureSelect = () => {
        return (
            <FormGroup fieldId='cache-feature'>
                <MoreInfoTooltip label={t('caches.create.configurations.feature.cache-feature-list')} toolTip={t('caches.create.configurations.feature.cache-feature-list-tooltip')} textComponent={TextVariants.h3} />
                <Select
                    variant={SelectVariant.typeaheadMulti}
                    typeAheadAriaLabel="Choose features"
                    onToggle={() => setIsOpenCacheFeature(!isOpenCacheFeature)}
                    onSelect={onSelect}
                    onClear={clearSelection}
                    selections={cacheFeatureSelected}
                    isOpen={isOpenCacheFeature}
                    aria-labelledby="cache-feature"
                    placeholderText={t('caches.create.configurations.feature.cache-feature-list-placeholder')}
                >
                    {cacheFeatureOptions()}
                </Select>
            </FormGroup>
        )
    }

    // Options for Eviction Strategy
    const evictionStrategyOptions = () => {
        return Object.keys(EvictionStrategy).map((key) => (
            <SelectOption key={key} value={EvictionStrategy[key]} />
        ));
    };

    // Options for Max Size Unit
    const unitOptions = () => {
        return Object.keys(MaxSizeUnit).map((key) => (
            <SelectOption key={key} value={MaxSizeUnit[key]} />
        ));
    }

    const formBoundedCache = () => {
        return (
            <React.Fragment>
                <Divider />
                <TextContent>
                    <Text component={TextVariants.h2}>Bounded</Text>
                </TextContent>

                <FormGroup
                    isRequired
                    fieldId="max-size"
                    validated={maxCount || (maxSizeNumber && parseInt(maxSizeNumber) >= 0) ? 'default' : 'error'}
                    helperTextInvalid={t('caches.create.configurations.feature.max-size-helper-invalid')}
                >
                    <MoreInfoTooltip label={t('caches.create.configurations.feature.max-size')} toolTip={t('caches.create.configurations.feature.max-size-tooltip')} textComponent={TextVariants.h3} />
                    <InputGroup>
                        <Grid>
                            <GridItem span={8}>
                                <TextInput min={0} isDisabled={maxCount !== undefined} value={maxSizeNumber} type="number" onChange={(value) => setMaxSizeNumber(value)} aria-label="max-size-number-input" />
                            </GridItem>
                            <GridItem span={4}>
                                <Select
                                    variant={SelectVariant.single}
                                    isDisabled={maxCount !== undefined}
                                    aria-label="max-size-unit-input"
                                    onToggle={() => setIsOpenMaxSizeUnit(!isOpenMaxSizeUnit)}
                                    onSelect={onSelectMaxCountUnit}
                                    selections={maxSizeUnit}
                                    isOpen={isOpenMaxSizeUnit}
                                    aria-labelledby="toggle-id-max-size-unit"
                                >
                                    {unitOptions()}
                                </Select>
                            </GridItem>

                        </Grid>
                    </InputGroup>
                </FormGroup>
                <FormGroup
                    isRequired
                    fieldId="max-count"
                    validated={maxSizeNumber || (maxCount && parseInt(maxCount) >= 0) ? 'default' : 'error'}
                    helperTextInvalid={t('caches.create.configurations.feature.max-count-helper-invalid')}
                >
                    <MoreInfoTooltip label={t('caches.create.configurations.feature.max-count')} toolTip={t('caches.create.configurations.feature.max-count-tooltip')} textComponent={TextVariants.h3} />
                    <TextInput min={0} isDisabled={maxSize !== undefined} value={maxCount} type="number" onChange={(value) => setMaxCount(value)} aria-label="max-count-input" />
                </FormGroup>
                <FormGroup fieldId='form-eviction-strategy'>
                    <MoreInfoTooltip label={t('caches.create.configurations.feature.eviction-strategy')} toolTip={t('caches.create.configurations.feature.eviction-strategy-tooltip')} textComponent={TextVariants.h3} />
                    <Select
                        variant={SelectVariant.single}
                        aria-label="eviction-strategy-select"
                        onToggle={() => setIsOpenEvictionStrategy(!isOpenEvictionStrategy)}
                        onSelect={onSelectEvictionStrategy}
                        selections={evictionStrategy}
                        isOpen={isOpenEvictionStrategy}
                        aria-labelledby="toggle-id-eviction-strategy"
                    >
                        {evictionStrategyOptions()}
                    </Select>
                </FormGroup>
            </React.Fragment>
        )
    }

    return (
        <Form>
            <TextContent>
                <Text component={TextVariants.h1}>{t('caches.create.configurations.feature.page-title')}</Text>
            </TextContent>

            {formCacheFeatureSelect()}
            {cacheFeatureSelected.includes(CacheFeature.BOUNDED) && formBoundedCache()}
        </Form>
    );
};

export default ConfigurationFeature;
