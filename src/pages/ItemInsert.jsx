/**
 * 파일명: ItemInsert.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 물품등록의 핵심 흐름:
 *
 * 1) form state에 물품명/가격/내용/수량 저장
 * 2) file input에서 File 객체를 image state에 저장
 * 3) URL.createObjectURL(file)로 브라우저 미리보기 생성
 * 4) submit 때 FormData를 만든 뒤 각 값을 append
 * 5) POST /api/item/insert.json 으로 multipart/form-data 전송
 * 6) 성공/실패 결과를 status state에 표시
 * 이름 구분: useState/useEffect/FormData/axios는 정해진 이름, form/image/preview/onFile/onSubmit은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 파일선택/등록/취소 버튼의 하이라이트와 패널 오파시티는
 * src/styles/site-brand.css에서 관리한다.
 * =========================================================
 */

import { useEffect, useState } from "react"
import axios from "axios"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../assets/brand/item-campus.png"

const initialForm = { name: "", price: "", content: "", quantity: "" }

export default function ItemInsert() {
  // ===== 수업 코드 1: 입력값 / 파일 / 요청상태 =====
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  // createObjectURL로 만든 임시 주소는 더 이상 필요 없을 때 revoke해야 메모리 누수를 막을 수 있다.
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  // ===== 수업 코드 2: controlled input =====
  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status.text) setStatus({ type: "", text: "" })
  }

  // ===== 수업 코드 3: 파일 선택 + 미리보기 =====
  const onFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
    if (status.text) setStatus({ type: "", text: "" })
  }

  // ===== 수업 코드 4: 입력 전체 초기화 =====
  const onCancel = () => {
    if (preview) URL.revokeObjectURL(preview)
    setForm(initialForm)
    setImage(null)
    setPreview("")
    setStatus({ type: "", text: "" })

    // file input은 일반 state value로 직접 제어하지 않으므로 DOM value도 비운다.
    const fileInput = document.getElementById("item-image")
    if (fileInput) fileInput.value = ""
  }

  // ===== 수업 코드 5: FormData -> POST =====
  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: "", text: "" })
    setSaving(true)

    try {
      const body = new FormData()
      body.append("name", form.name)
      body.append("price", form.price)
      body.append("content", form.content)
      body.append("quantity", form.quantity)
      if (image) body.append("image", image)

      // FormData를 axios에 넘기면 브라우저가 multipart boundary를 포함한 Content-Type을 자동으로 설정한다.
      const { data } = await axios.post("/api/item/insert.json", body)

      if (Number(data?.status) === 200) {
        setStatus({ type: "success", text: "물품이 등록되었습니다." })
      } else {
        setStatus({ type: "error", text: data?.message || "물품 등록 결과를 확인해주세요." })
      }
    } catch (error) {
      console.error("물품등록 실패", error)
      setStatus({ type: "error", text: "물품 등록에 실패했습니다." })
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <SiteShell active="물품등록" background={campusBg} backgroundPosition="center center" veil="item" className="item-insert-page">
      <section className="item-runtime-title item-runtime-title--insert">
        <p className="item-runtime-title__eyebrow">PKNU CAMPUS MARKET</p>
        <h1>물품등록</h1>
        <p>물품 정보와 대표 이미지를 입력합니다.</p>
      </section>

      <section className="item-insert-runtime">
        <aside className="item-runtime-panel item-insert-runtime__preview">
          <div className="item-runtime-panel__head">
            <div><p>PREVIEW</p><h2>등록 미리보기</h2></div>
          </div>
          <input id="item-image" className="item-runtime-image-input" type="file" accept="image/*" onChange={onFile} />
          <label className="item-runtime-preview" htmlFor="item-image">
            {preview ? <img src={preview} alt="선택한 물품 미리보기" /> : (
              <div className="item-runtime-preview__empty">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V5"/><path d="m8 9 4-4 4 4"/><path d="M5 14v4.2A1.8 1.8 0 0 0 6.8 20h10.4a1.8 1.8 0 0 0 1.8-1.8V14"/></svg>
                <strong>대표 이미지</strong>
                <span>대표 이미지 영역을 눌러 파일을 고르세요.</span>
              </div>
            )}
          </label>
        </aside>

        <section className="item-runtime-panel item-insert-runtime__form-panel">
          <div className="item-runtime-panel__head">
            <div><p>ITEM INFORMATION</p><h2>물품 정보</h2></div>
          </div>

          <form id="item-insert-form" className="item-runtime-form" onSubmit={onSubmit}>
            <label className="item-runtime-field item-runtime-field--full">
              <span>물품명</span>
              <input name="name" value={form.name} onChange={onChange} placeholder="물품명을 입력하세요." required />
            </label>
            <label className="item-runtime-field">
              <span>가격</span>
              <input name="price" type="number" min="0" value={form.price} onChange={onChange} placeholder="가격을 입력하세요." required />
            </label>
            <label className="item-runtime-field">
              <span>수량</span>
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={onChange} placeholder="판매수량을 입력하세요." required />
            </label>
            <label className="item-runtime-field item-runtime-field--full">
              <span>상세 내용</span>
              <textarea name="content" value={form.content} onChange={onChange} placeholder="물품내용을 입력하세요." required />
            </label>
          </form>

          {status.text && <p className={`item-runtime-status is-${status.type}`} role="status">{status.text}</p>}

          <div className="item-runtime-actions">
            <button type="button" className="brand-secondary item-cancel-highlight" onClick={onCancel} disabled={saving}>취소</button>
            <button type="submit" form="item-insert-form" className="brand-primary item-submit-highlight" disabled={saving}>{saving ? "등록 중..." : "등록하기"}</button>
          </div>
        </section>
      </section>
    </SiteShell>
  )
}
