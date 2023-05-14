import { GetServerSidePropsResult } from "next";
import Head from "next/head";

import { NavItem, Wrapper } from "~/components/Wrapper";
import { getLeftSideMenuItems } from "~/helper/leftSideMenuHelper";
import { title } from "~/helper/title";

interface HomeProps {
    leftSideMenuItems: NavItem[];
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<HomeProps>> {
    return { props: { leftSideMenuItems: await getLeftSideMenuItems() } };
}

export default function Home({ leftSideMenuItems }: HomeProps) {
    return (
        <>
            <Head>
                <title>{ title("Home") }</title>
            </Head>
            <Wrapper leftSideMenuItems={ leftSideMenuItems }>
                Something
            </Wrapper>
        </>
    );
}
