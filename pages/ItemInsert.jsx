import { useState } from "react"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../src/assets/brand/glass-campus.png"

export default function ItemInsert() {
  const [form, setForm] = useState({ name: "", price: "", content: "", quantity: "1", category: "" })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState("")

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    // 기존 프로젝트의 실제 API 전송 코드는 그대로 연결할 수 있도록 state/form 구조를 유지한다.
    console.log({ ...form, image })
  }

  return (
    <SiteShell active="물품등록" background={campusBg} backgroundPosition="center" veil="left" className="item-insert-page">
      <section className="item-insert-page__layout">
        <aside className="brand-panel item-insert-page__preview">
          <div className="brand-heading">
            <div>
              <p className="brand-heading__eyebrow">PREVIEW</p>
              <h2>등록 미리보기</h2>
            </div>
          </div>
          <label className="item-upload-preview" htmlFor="item-image">
            {preview ? <img src={preview} alt="선택한 물품 미리보기" /> : (
              <div className="item-upload-preview__empty">
                <strong>사진을 등록하세요</strong>
                <span>클릭해서 대표 이미지를 선택합니다.</span>
              </div>
            )}
          </label>
          <p className="brand-copy">물품의 상태가 잘 보이는 밝은 사진 한 장을 먼저 선택하면 카드에서도 더 깔끔하게 보입니다.</p>
        </aside>

        <section className="brand-panel item-insert-page__form-panel">
          <div className="brand-heading">
            <div>
              <p className="brand-heading__eyebrow">ITEM INSERT</p>
              <h1>물품등록</h1>
              <p>게시판에서 확정한 네온 버튼과 어두운 유리 패널 톤을 그대로 확장했습니다.</p>
            </div>
          </div>

          <form id="item-insert-form" className="item-form-grid" onSubmit={onSubmit}>
            <div className="item-field item-field--full">
              <label htmlFor="item-name">물품명</label>
              <input id="item-name" name="name" value={form.name} onChange={onChange} placeholder="물품명을 입력하세요." />
            </div>
            <div className="item-field">
              <label htmlFor="item-category">카테고리</label>
              <select id="item-category" name="category" value={form.category} onChange={onChange}>
                <option value="">카테고리를 선택하세요.</option>
                <option value="전자기기">전자기기</option>
                <option value="생활용품">생활용품</option>
                <option value="도서">도서</option>
                <option value="스포츠·취미">스포츠·취미</option>
              </select>
            </div>
            <div className="item-field">
              <label htmlFor="item-price">가격</label>
              <input id="item-price" name="price" value={form.price} onChange={onChange} placeholder="가격을 입력하세요." />
            </div>
            <div className="item-field">
              <label htmlFor="item-quantity">수량</label>
              <input id="item-quantity" name="quantity" value={form.quantity} onChange={onChange} />
            </div>
            <div className="item-field">
              <label htmlFor="item-image">대표 이미지</label>
              <input id="item-image" type="file" accept="image/*" onChange={onFile} />
            </div>
            <div className="item-field item-field--full">
              <label htmlFor="item-content">상세 내용</label>
              <textarea id="item-content" name="content" value={form.content} onChange={onChange} placeholder="상태, 거래 위치, 참고사항을 입력하세요." />
            </div>
          </form>

          <div className="item-form-actions">
            <button type="button" className="brand-secondary">취소</button>
            <button type="submit" form="item-insert-form" className="brand-primary">등록하기</button>
          </div>
        </section>
      </section>
    </SiteShell>
  )
}
