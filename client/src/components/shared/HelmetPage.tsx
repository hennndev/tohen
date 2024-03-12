import { Helmet, HelmetProvider } from 'react-helmet-async';
type PropsTypes = {
    title: string
    content: string
}
const HelmetPage = ({title, content}: PropsTypes) => {
    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="description" content={content}/>
            </Helmet>
        </HelmetProvider>
    )
}
export default HelmetPage