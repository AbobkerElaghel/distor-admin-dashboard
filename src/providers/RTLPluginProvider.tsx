import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, useContext } from 'react';
import { RTLContext } from './RTLProvider';

// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

export default function RTL(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) {
    const context = useContext(RTLContext);
    return context?.isRTL ? <CacheProvider value={cacheRtl}>{props.children}</CacheProvider> : <>{props.children}</>
}