import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const NO_IMAGE = "/images/no-image.png"

const ProductDetail = () => {
    const {id} = useParams<{id: string}>();
    const {products, isLoading, removeProduct} = useProduct();
    const {addToCart, removeFromCart} = useCart();
    const { currentUser } = useUser();
    const navigate = useNavigate();
    
    // 상품 목록을 불러오는 동안에는 로딩 문구 표시
    if(isLoading){
        return <div>불러오는 중...</div>
    }

    // 관리자에게만 수정. 삭제 버튼 보여줌
    const isAdmin = (currentUser?.role === "admin");

    // product/3  - 3이 문자이므로 숫자로 형변환
    const product = products.find(p => p.id === Number(id))

    if(!product){
        return <div>상품을 찾을 수 없습니다.</div>
    }

    // 상품 삭제 핸들러
    const handleDelete = async () => {
        if(!window.confirm("정말로 상품을 삭제할까요?")) return;
        try{
            await removeProduct(product.id); 
            removeFromCart(product.id);
            alert("상품이 삭제되었습니다.");
            navigate("/");
        }catch{
            alert("상품 삭제 중 오류가 발생했습니다.")
        }
    }

    return(
        <div className="product-detail">
            {/* -?.은 옵셔널 체이닝- 상품을 못찾아 undefined일때 오류 대신
              undefined를 돌려준다 */}
            <Link to='/' className="product-detail_back" >← 상품 목록</Link>
            <Link to={`/product/${product.id}`}>
                <img 
                    className="product-detail_img"
                    src={product.image ?? NO_IMAGE}
                    alt={product.pName} 
                />
            </Link>
            <span className="product-detail_category">{product?.category}</span>
            <h2>{product?.pName}</h2>
            <p className="product-detail_price">{product?.price.toLocaleString()}원</p>
            <p className="product-detail_desc">{product?.description}</p>
            <button 
                className="product-detail_cart"
                onClick={() => {
                    // 로그인하지 않은 경우 로그인 페이지로 이동
                    if (!currentUser) {
                        alert("로그인이 필요합니다.");
                        navigate("/signin");
                        return;
                    }
                    addToCart(product.id, 1);
                    alert("상품이 장바구니에 담겼습니다.")
                }}
            >
            담기
            </button>
            {/* 관리자 메뉴: 수정, 삭제 */}
            {isAdmin && (
                <div className="product-detail_admin">
                    <Link to={`/product/${product.id}/edit`}
                          className="product-detail_edit">수정</Link>
                    <button className="product-detail_delete"
                        onClick={handleDelete}>삭제</button>
                </div>
            )}
        </div>
    )
}

export default ProductDetail;
