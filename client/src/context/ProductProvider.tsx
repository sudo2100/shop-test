import { useEffect, useState } from "react"
import { ProductContext } from "./ProductContext"
import type {NewProduct, Product} from "../types/product"
import { 
    getProducts, 
    createProduct, 
    deleteProduct,
    modifyProduct
 } from "../api/products"

// ProductProvider는 저장소(repository) 역할
const ProductProvider = ({children} : {children: React.ReactNode}) => {
    const [products, setProducts] = useState<Product[]>([]);
    // 처음에는 불러오는 중(true), 응답을 받으면(성공/실패 모두) false
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 상품 목록 불러오기(화면이 렌더링될때 한 번 가져옴)
    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(err => console.log("상품 목록 조회 오류", err))
            .finally(() => setIsLoading(false));
    }, []);
    
    // 상품 추가 함수
    const addProduct = async (newProduct: NewProduct) => {
        await createProduct(newProduct); // DB에 상품 등록
        setProducts(await getProducts()); // 등록된 상품을 배열에 저장
    }

    // 상품 삭제 함수(외부입력 상품아이디 - productId)
    const removeProduct = async (productId: number) => {
        await deleteProduct(productId);
        setProducts(products.filter(product => product.id != productId))
    }

    // 상품 수정 함수
    const updateProduct = async (updatedProduct: Product) => {
        await modifyProduct(updatedProduct);
        setProducts(products.map(product => 
            product.id === updatedProduct.id ? updatedProduct : product
        ))
    }

    return(
        <ProductContext.Provider value={{
            products,
            isLoading,
            addProduct,
            removeProduct,
            updateProduct
        }}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider