import { useState } from 'react'
import { theme, card, btn, input, brl, rotuloEstado, rotuloStatusItem } from '../../lib/theme.js'
import { useDrawerAntiFechamento } from '../../lib/useDrawerAntiFechamento.js'
import Badge from '../../components/Badge.jsx'
import ItemImagem from '../../components/ItemImagem.jsx'

// A partir de 6 meses parado o item vira oportunidade de remanejamento — é o selo
// que o almoxarife procura no catálogo.
export const MESES_PARA_OCIOSO = 6
export const estaOcioso = (item) => (item.paradoDesdeMeses ?? 0) >= MESES_PARA_OCIOSO

// input type="month" ("AAAA-MM") → meses parado até hoje (para casar com o seed).
function mesesDesde(mesAno) {
  if (!mesAno) return null
  const [ano, mes] = mesAno.split('-').map(Number)
  const hoje = new Date()
  return Math.max(0, (hoje.getFullYear() - ano) * 12 + (hoje.getMonth() - (mes - 1)))
}

// Foto do upload reduzida no cliente (JPEG ~800px): o data URL cabe no localStorage
// sem estourar o limite, e a demo não depende de servidor de imagens.
function lerImagemRedimensionada(file, maxLado = 800) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => {
      const img = new Image()
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
        const w = Math.round(img.width * escala)
        const h = Math.round(img.height * escala)
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = leitor.result
    }
    leitor.onerror = reject
    leitor.readAsDataURL(file)
  })
}

function Filtros({ filtro, setFiltro, categorias }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
      <input
        style={{ ...input, flex: '1 1 260px' }}
        placeholder="Buscar por nome ou nº de patrimônio…"
        value={filtro.q}
        onChange={(e) => setFiltro({ ...filtro, q: e.target.value })}
      />
      <select style={input} value={filtro.categoria_id} onChange={(e) => setFiltro({ ...filtro, categoria_id: e.target.value })}>
        <option value="">Todas as categorias</option>
        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <select style={input} value={filtro.status} onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}>
        <option value="">Todos os status</option>
        <option value="disponivel">Disponível</option>
        <option value="reservado">Reservado</option>
        <option value="transferido">Transferido</option>
      </select>
    </div>
  )
}

function ItemCard({ item, siglaSecretaria, nomeCategoria, onAbrir }) {
  return (
    <button
      onClick={onAbrir}
      className="card-elevavel"
      style={{ ...card, padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: theme.font, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <ItemImagem item={item} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <strong style={{ fontSize: 15, color: theme.color.ink }}>{item.nome}</strong>
          <Badge tone={item.status}>{rotuloStatusItem[item.status]}</Badge>
        </div>
        <div style={{ fontSize: 13, color: theme.color.inkSoft }}>
          {nomeCategoria} · {siglaSecretaria}{item.patrimonio ? ` · ${item.patrimonio}` : ''}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 13, color: theme.color.inkSoft }}>
            Saldo livre: <strong style={{ color: theme.color.ink }}>{item.saldo_livre}</strong> / {item.quantidade}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.color.primaryDark, fontVariantNumeric: 'tabular-nums' }}>
            {brl(item.valor_unitario_estimado)}/{item.unidade}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Badge tone="neutro">{rotuloEstado[item.estado_conservacao]}</Badge>
          {estaOcioso(item) && <Badge tone="ocioso">Ocioso há {item.paradoDesdeMeses} meses</Badge>}
        </div>
      </div>
    </button>
  )
}

// Casca visual comum dos drawers (backdrop + painel lateral). É a DONA única do hook
// anti-fechamento, então backdrop, Esc e o aviso de descarte vêm todos da mesma
// fonte. `children` é uma função que recebe { avisoDescarte } para desenhar o aviso
// onde fizer sentido (perto dos botões), sem duplicar a lógica.
function DrawerShell({ titulo, dirty, onFechar, children }) {
  const { backdropRef, backdropHandlers, avisoDescarte } = useDrawerAntiFechamento({ dirty, onClose: onFechar })
  return (
    <div
      ref={backdropRef}
      {...backdropHandlers}
      style={{ position: 'fixed', inset: 0, background: 'rgba(28,35,33,.35)', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }}
    >
      <div style={{ width: 'min(460px, 100%)', background: theme.color.surface, height: '100%', padding: 24, overflowY: 'auto', fontFamily: theme.font }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: theme.color.ink }}>{titulo}</h2>
          <button onClick={onFechar} aria-label="Fechar" title="Fechar" style={{ ...btn('quieto'), padding: '4px 12px', fontSize: 16, lineHeight: 1.2 }}>✕</button>
        </div>
        {children({ avisoDescarte })}
      </div>
    </div>
  )
}

const avisoDescarteBox = (texto) => (
  <p style={{ margin: 0, fontSize: 13, color: theme.color.amber, fontWeight: 600 }}>{texto}</p>
)

const rotuloCampo = { fontSize: 13, color: theme.color.inkSoft, display: 'flex', flexDirection: 'column', gap: 4 }

function DrawerCadastro({ categorias, onCadastrar, onFechar }) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria_id, setCategoriaId] = useState('')
  const [unidade, setUnidade] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [estado, setEstado] = useState('bom')
  const [patrimonio, setPatrimonio] = useState('')
  const [preco, setPreco] = useState('')
  const [mesAno, setMesAno] = useState('')
  const [foto, setFoto] = useState(null)
  const [processandoFoto, setProcessandoFoto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  // Qualquer trabalho do usuário que fechar destruiria (mesma ideia do drawer de requisição).
  const sujo = Boolean(nome || descricao || categoria_id || unidade || quantidade || patrimonio || preco || mesAno || foto) || estado !== 'bom'
  const mesAtual = new Date().toISOString().slice(0, 7)

  async function aoEscolherFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setProcessandoFoto(true); setErro(null)
    try {
      setFoto(await lerImagemRedimensionada(file))
    } catch {
      setErro('Não consegui ler essa imagem. Tente outra.')
    } finally {
      setProcessandoFoto(false)
    }
  }

  async function salvar() {
    setEnviando(true); setErro(null)
    try {
      await onCadastrar({
        nome, descricao, categoria_id, unidade, quantidade,
        estado_conservacao: estado, patrimonio,
        valor_unitario_estimado: preco,
        paradoDesdeMeses: mesesDesde(mesAno),
        imageUrl: foto,
      })
      onFechar() // sucesso: fechar é gesto deliberado, ignora a proteção
    } catch (e) {
      setErro(e.message)
      setEnviando(false)
    }
  }

  return (
    <DrawerShell titulo="Cadastrar item ocioso" dirty={sujo} onFechar={onFechar}>
      {({ avisoDescarte }) => (
      <>
      <p style={{ color: theme.color.inkSoft, fontSize: 13, margin: '6px 0 16px' }}>
        Publique um item parado na sua secretaria. Ele entra no catálogo na hora, disponível para as outras.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={rotuloCampo}>
          Nome do item
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Cadeira giratória com braços" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>

        <label style={rotuloCampo}>
          Descrição (opcional)
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Cor, estado, detalhes" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={rotuloCampo}>
            Categoria
            <select value={categoria_id} onChange={(e) => setCategoriaId(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }}>
              <option value="">Selecione</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </label>
          <label style={rotuloCampo}>
            Estado de conservação
            <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }}>
              {Object.entries(rotuloEstado).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={rotuloCampo}>
            Quantidade
            <input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
          </label>
          <label style={rotuloCampo}>
            Unidade
            <input value={unidade} onChange={(e) => setUnidade(e.target.value)} placeholder="un, resma, fardo 14 pct…" style={{ ...input, width: '100%', marginTop: 4 }} />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={rotuloCampo}>
            Preço de referência (un.)
            <input type="number" min={0} step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="R$" style={{ ...input, width: '100%', marginTop: 4 }} />
          </label>
          <label style={rotuloCampo}>
            Parado desde
            <input type="month" max={mesAtual} value={mesAno} onChange={(e) => setMesAno(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
          </label>
        </div>

        <label style={rotuloCampo}>
          Nº de patrimônio (opcional)
          <input value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} placeholder="Vazio = material de consumo" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>

        <div style={rotuloCampo}>
          Foto (opcional)
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
            <div style={{ width: 84, height: 84, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#EDF1F4', border: `1px solid ${theme.color.line}` }}>
              {foto && <img src={foto} alt="Pré-visualização" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ ...btn('quieto'), padding: '7px 12px', cursor: 'pointer' }}>
                {processandoFoto ? 'Processando…' : foto ? 'Trocar foto' : 'Escolher foto'}
                <input type="file" accept="image/*" onChange={aoEscolherFoto} style={{ display: 'none' }} />
              </label>
              {foto && (
                <button type="button" style={{ ...btn('quieto'), padding: '7px 12px' }} onClick={() => setFoto(null)}>Remover</button>
              )}
            </div>
          </div>
          <span style={{ fontSize: 12, color: theme.color.inkSoft }}>Sem foto, o catálogo usa o ícone da categoria.</span>
        </div>

        {avisoDescarte && avisoDescarteBox('Você tem dados preenchidos. Salve o item ou use Cancelar para descartar.')}
        {erro && <p style={{ margin: 0, fontSize: 13, color: theme.color.danger, fontWeight: 600 }}>{erro}</p>}

        <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${theme.color.line}`, paddingTop: 14 }}>
          <button style={{ ...btn('primario'), flex: 1 }} disabled={enviando || processandoFoto} onClick={salvar}>
            {enviando ? 'Salvando…' : 'Cadastrar item'}
          </button>
          <button type="button" style={btn('quieto')} onClick={onFechar}>Cancelar</button>
        </div>
      </div>
      </>
      )}
    </DrawerShell>
  )
}

function PainelItem({ item, usuario, secretarias, categorias, onRequisitar, onFechar }) {
  const [quantidade, setQuantidade] = useState(1)
  const [justificativa, setJustificativa] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [msg, setMsg] = useState(null)

  const ehPropria = usuario.papel === 'secretaria' && item.secretaria_id === usuario.secretaria_id
  const podeRequisitar = usuario.papel === 'secretaria' && !ehPropria && item.saldo_livre > 0
  const dona = secretarias.find((s) => s.id === item.secretaria_id)

  // "Sujo" = há trabalho do usuário que fechar destruiria. Sem formulário na tela
  // (gestor, item da própria secretaria) nunca há o que perder.
  const sujo = podeRequisitar && (justificativa.trim() !== '' || Number(quantidade) !== 1)

  async function enviar() {
    setEnviando(true); setMsg(null)
    try {
      await onRequisitar({ item_id: item.id, quantidade: Number(quantidade), justificativa })
      setMsg({ ok: true, texto: 'Requisição enviada. Acompanhe na aba Requisições.' })
      // Enviado, nada mais a perder: limpar devolve o fechamento por backdrop/Esc.
      setQuantidade(1); setJustificativa('')
    } catch (e) {
      setMsg({ ok: false, texto: e.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <DrawerShell titulo={item.nome} dirty={sujo} onFechar={onFechar}>
      {({ avisoDescarte }) => (
      <>
      <div style={{ margin: '14px 0 12px' }}>
        <ItemImagem item={item} radius={theme.radius.card} />
      </div>

      {estaOcioso(item) && (
        <div style={{ marginBottom: 10 }}>
          <Badge tone="ocioso">Ocioso há {item.paradoDesdeMeses} meses</Badge>
        </div>
      )}

      <p style={{ color: theme.color.inkSoft, fontSize: 14, margin: 0 }}>{item.descricao}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14, margin: '14px 0' }}>
        <div>Patrimônio<br /><strong>{item.patrimonio || 'Material de consumo'}</strong></div>
        <div>Secretaria dona<br /><strong>{dona?.sigla}</strong></div>
        <div>Categoria<br /><strong>{categorias.find((c) => c.id === item.categoria_id)?.nome}</strong></div>
        <div>Conservação<br /><strong>{rotuloEstado[item.estado_conservacao]}</strong></div>
        <div>Saldo livre<br /><strong>{item.saldo_livre} de {item.quantidade} {item.unidade}</strong></div>
        <div>Valor de referência<br /><strong>{brl(item.valor_unitario_estimado)}/{item.unidade}</strong></div>
      </div>

      {podeRequisitar && (
        <div style={{ borderTop: `1px solid ${theme.color.line}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <strong style={{ fontSize: 15 }}>Requisitar este item</strong>
          <label style={{ fontSize: 13, color: theme.color.inkSoft }}>
            Quantidade (máx. {item.saldo_livre})
            <input type="number" min={1} max={item.saldo_livre} value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 13, color: theme.color.inkSoft }}>
            Justificativa
            <textarea rows={3} value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Para onde vai e por quê" style={{ ...input, width: '100%', marginTop: 4, resize: 'vertical' }} />
          </label>
          {avisoDescarte && avisoDescarteBox('Você tem dados preenchidos. Envie a requisição ou use Cancelar para descartar.')}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...btn('primario'), flex: 1 }} disabled={enviando || !justificativa.trim()} onClick={enviar}>
              {enviando ? 'Enviando…' : 'Enviar requisição'}
            </button>
            <button type="button" style={btn('quieto')} onClick={onFechar}>Cancelar</button>
          </div>
        </div>
      )}

      {ehPropria && <p style={{ fontSize: 13, color: theme.color.inkSoft }}>Este item pertence à sua secretaria.</p>}
      {usuario.papel === 'gestor' && <p style={{ fontSize: 13, color: theme.color.inkSoft }}>Gestores aprovam requisições na aba Requisições.</p>}

      {msg && (
        <p style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: msg.ok ? theme.color.primaryDark : theme.color.danger }}>
          {msg.texto}
        </p>
      )}
      </>
      )}
    </DrawerShell>
  )
}

export default function CatalogoView({ itens, categorias, secretarias, usuario, filtro, setFiltro, onRequisitar, onCadastrarItem }) {
  const [aberto, setAberto] = useState(null)
  const [cadastrando, setCadastrando] = useState(false)
  const itemAberto = aberto ? itens.find((i) => i.id === aberto) : null

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button style={btn('primario')} onClick={() => setCadastrando(true)}>+ Cadastrar item ocioso</button>
      </div>

      <Filtros filtro={filtro} setFiltro={setFiltro} categorias={categorias} />
      {itens.length === 0 ? (
        <div style={{ ...card, padding: 24, color: theme.color.inkSoft, fontSize: 14 }}>
          Nenhum item com esses filtros. Limpe a busca ou mude a categoria para ver o estoque da rede.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
          {itens.map((i) => (
            <ItemCard
              key={i.id}
              item={i}
              siglaSecretaria={secretarias.find((s) => s.id === i.secretaria_id)?.sigla}
              nomeCategoria={categorias.find((c) => c.id === i.categoria_id)?.nome}
              onAbrir={() => setAberto(i.id)}
            />
          ))}
        </div>
      )}

      {itemAberto && (
        <PainelItem
          item={itemAberto}
          usuario={usuario}
          secretarias={secretarias}
          categorias={categorias}
          onRequisitar={onRequisitar}
          onFechar={() => setAberto(null)}
        />
      )}

      {cadastrando && (
        <DrawerCadastro
          categorias={categorias}
          onCadastrar={onCadastrarItem}
          onFechar={() => setCadastrando(false)}
        />
      )}
    </section>
  )
}
