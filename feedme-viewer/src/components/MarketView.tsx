import classNames from "classnames";

import { DropDown, DropDownItem } from "~/components/DropDown";
import { stripPipeEscapes } from "~/helper/stringHelper";
import { MarketView } from "~/service/MongoService";

import marketView from "~/components/MarketView.module.css";

const outcomeClassNames = (suspended: boolean) => {
    return classNames({
        [marketView.outcomeSuspended]: suspended,
        [marketView.outcome]: true,
        [marketView.outcomeRight]: true,
    });
};

interface MarketViewProps {
    marketsData: MarketView[];
    open?: boolean;
}

export function MarketList({ marketsData, open }: MarketViewProps): JSX.Element {
    return (
        <>
            { marketsData.map((market) => (
                <DropDown open={ open } key={ market.marketId } summaryText={ market.name }>
                    { market.outcomes.map((outcome) => (
                        <DropDownItem key={ `${outcome.outcomeId} ${Math.random()}` } className={ marketView.dropDown }>
                            <span
                                className={ marketView
                                    .outcomeWrapper }
                            >
                                <i
                                    className={ classNames(marketView
                                        .outcome, marketView
                                        .outcomeLeft) }
                                >
                                    { stripPipeEscapes(outcome
                                        .name) }
                                </i>
                                <i
                                    className={ outcomeClassNames(outcome
                                        .suspended
                                        || market
                                            .suspended) }
                                >
                                    { outcome
                                        .price }
                                </i>
                            </span>
                        </DropDownItem>
                    )) }
                </DropDown>
            )) }
        </>
    );
}
