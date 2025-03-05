import { APP_NAME } from '@/lib/constants'


const Footer = () => {
    const currentYear = new Date().getFullYear();
    return ( 
        <footer className="boder-t">
            <div className="p-f flex-center">
                {currentYear} {APP_NAME}. All Rights Reserved
            </div>
        </footer>
     );
}
 
export default Footer;