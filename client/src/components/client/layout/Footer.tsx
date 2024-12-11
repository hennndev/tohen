import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import useDecodeToken from '@/hooks/useDecodeToken'
import { getCurrentToken } from '@/store/features/authSlice'
import { useGetBrandsQuery } from '@/store/api/brandsApiSlice'
import { useGetCategoriesQuery } from '@/store/api/categoriesApiSlice'
// components
import { Shell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'

const Footer = () => {
    const dataDecoded = useDecodeToken()
    const currentToken = useSelector(getCurrentToken)
    const userRole = dataDecoded?.UserInfo?.role as string
    const {data: brandsData, isSuccess: isSuccessCategoriesData} = useGetBrandsQuery('')
    const {data: categoriesData, isSuccess: isSuccessBrandsData} = useGetCategoriesQuery('')

    return (
        <footer className='!min-h-[380px] w-full bg-[#222] dark:bg-[#111] mt-auto'>
            <div className='!container p-5 pt-10 pb-0'>
                <div className='flex flex-wrap justify-between pb-5 border-b border-gray-700 xl:space-x-10'>
                    <div className='flex flex-col space-y-4 mr-5 mb-10 max-w-[300px]'>
                        <h1 className='flexx text-3xl font-bold text-gray-100 !mb-5'>
                            <Shell className='mr-2'/>
                            TOHEN.
                        </h1>
                        <div className='flex flex-col space-y-3'>
                            <div className='flex flex-col space-y-1'>
                                <h1 className='text-2xl font-bold text-gray-200'>Subscribe</h1>
                                <p className='text-gray-400'>Receive products news and update on your inbox</p>
                            </div>
                            <Input type='email' id='email' className='max-w-[250px] placeholder:text-center lg:placeholder:text-left' placeholder="Input email here"/>
                        </div>
                    </div>
                    <div className='flex flex-col space-y-3 text-gray-100 mr-10 lg:mr-0 mb-10 min-w-[100px] max-w-[230px]'>
                        <h2 className='text-xl font-bold'>Company</h2>
                        <Link to='/products' className='text-base text-gray-400'>About Us</Link>
                        <Link to='/products' className='text-base text-gray-400'>FAQ</Link>
                        <Link to='/products' className='text-base text-gray-400'>Terms of Use</Link>
                        <Link to='/products' className='text-base text-gray-400'>Privacy Policy</Link>
                        <Link to='/products' className='text-base text-gray-400'>Affiliate</Link>
                        <Link to='/products' className='text-base text-gray-400'>Strategic Partners</Link>
                    </div>
                    <div className='flex flex-col space-y-3 text-gray-100 mr-10 lg:mr-0 mb-10 min-w-[100px] max-w-[230px]'>
                        <h2 className='text-xl font-bold'>Menu</h2>
                        <Link to='/' className='text-base text-gray-400'>Homepage</Link>
                        <Link to='/products' className='text-base text-gray-400'>Products</Link>
                        <Link to='/cart' className='text-base text-gray-400'>Cart</Link>
                        {userRole === 'admin' && currentToken && <Link to='/admin/products' className='text-base text-gray-400'>Dashboard</Link>}
                        {userRole === 'customer' && currentToken && (
                            <Fragment>
                                <Link to='/orders-history' className='text-base text-gray-400'>Orders History</Link>
                                <Link to='/wishlist' className='text-base text-gray-400'>Wishlist</Link>
                            </Fragment>
                        )}
                        {dataDecoded && currentToken && <Link to='/profile' className='text-base text-gray-400'>Profile</Link>}
                    </div>
                    <div className='flex flex-col space-y-3 text-gray-100 mr-10 lg:mr-0 mb-10 min-w-[100px] max-w-[230px]'>
                        <h2 className='text-xl font-bold'>Products</h2>
                        {isSuccessCategoriesData && categoriesData?.data.map((category: CategoryTypes) => (
                            <Link to={`/products?category=${category.category}`} key={category._id} className='text-base text-gray-400 capitalize'>{category.category}</Link>
                        ))}
                    </div>
                    <div className='flex flex-col space-y-3 text-gray-100 mr-10 lg:mr-0 mb-10 min-w-[100px] max-w-[230px]'>
                        <h2 className='text-xl font-bold'>Brands</h2>
                        {isSuccessBrandsData && brandsData?.data.map((brand: BrandTypes) => (
                            <Link to={`/products?brand=${brand.brand}`} key={brand._id} className='text-base text-gray-400 capitalize'>{brand.brand}</Link>
                        ))}
                    </div>
                    <div className='flex flex-col space-y-3 text-gray-100 mr-10 lg:mr-0 mb-10 min-w-[100px] max-w-[230px]'>
                        <h2 className='text-xl font-bold'>Contact  </h2>
                        <p className='text-base text-gray-400'>
                            Email <br />
                            <a href='https://www.google.com' target='_blank' className='text-gray-400'>Contact Us</a>
                        </p>
                        <p className='text-base text-gray-400'>
                            Telephone <br />
                            <a href='https://www.google.com' target='_blank' className='text-gray-400'>+62891111111</a>
                        </p>
                        <p className='text-base text-gray-400'>
                            Address <br />
                            <span>Jl. Ahmad Yani no.31, Purbalingga</span>
                        </p>
                    </div>
                </div>
                <div className='flex-center flex-col space-y-5 pt-5 pb-5'>
                    <p className='text-base text-center text-gray-400'>@2024 Created by Hennndev. All right reserved</p>
                    <div className='flexx space-x-4 text-gray-100'>
                        <a href="https://www.instagram.com/hennnnndev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        <a href="https://web.facebook.com" target='_blank'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer