import { create } from "zustand";
import dayjs from "dayjs";
import { useAuthStore } from "./authStore";

// API response interfaces for type safety
interface ApiWorkFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface ApiWork {
  id: string;
  titulo: string;
  autor: string;
  coautor?: string;
  isrc?: string;
  iswc?: string;
  status: "PENDING" | "WAITING_PAYMENT" | "AUTHORIZED" | "EXCLUSIVE" | "REJECTED";
  arquivos?: ApiWorkFile[];
  dataCreacao: string;
  dataAtualizacao: string;
  codigoExclusivo?: string;
  codigo: string;
  usuarioId: string;
  profileId?: string;
  userId?: string;
}

interface ApiWorksResponse {
  success: boolean;
  obras?: ApiWork[];
  message?: string;
  total?: number;
}

interface ApiWorkResponse {
  success: boolean;
  obra?: ApiWork & { files?: ApiWorkFile[] };
  message?: string;
}

export interface WorkFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Work {
  id: string;
  title: string;
  author: string;
  coauthor?: string;
  isrc?: string;
  iswc?: string;
  status:
    | "PENDING"
    | "WAITING_PAYMENT"
    | "AUTHORIZED"
    | "EXCLUSIVE"
    | "REJECTED";
  files: WorkFile[];
  createdAt: string;
  updatedAt: string;
  exclusiveCode?: string;
  code: string;
  userId: string;
}

export interface WorkStatistics {
  totalObras: number;
  pendentes: number;
  autorizadas: number;
  aguardandoPagamento: number;
  exclusivas: number;
  rejeitadas: number;
}

interface WorksState {
  works: Work[];
  statistics: WorkStatistics | null;
  isLoading: boolean;
  isSearching: boolean;
  currentWork: Work | null;
  totalWorks: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;

  // Actions
  fetchWorks: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchWork: (id: string) => Promise<void>;
  createWork: (workData: Partial<Work>) => Promise<Work>;
  updateWork: (id: string, workData: Partial<Work>) => Promise<void>;
  updateWorkStatus: (id: string, status: Work["status"]) => Promise<void>;
  deleteWork: (id: string) => Promise<void>;
  uploadFiles: (workId: string, files: File[]) => Promise<WorkFile[]>;
  searchPublicWork: (code: string) => Promise<Work | null>;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  clearSearch: () => Promise<void>;
}

export const useWorksStore = create<WorksState>((set, get) => ({
  works: [],
  statistics: null,
  isLoading: false,
  isSearching: false,
  currentWork: null,
  totalWorks: 0,
  currentPage: 1,
  totalPages: 0,
  searchTerm: "",

  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 1 });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  clearSearch: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isSearching: true, searchTerm: "", currentPage: 1 });

    try {
      await get().fetchWorks(1, 5, "");
    } catch (error) {
      console.error("❌ Erro ao limpar busca:", error);
      throw error;
    } finally {
      set({ isSearching: false });
    }
  },

  fetchStatistics: async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ statistics: null });
        return;
      }

      console.log("📊 Buscando estatísticas do usuário:", user.id);

      const response = await fetch(`/api/works/statistics?userId=${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao buscar estatísticas");
      }

      console.log("✅ Estatísticas carregadas:", data.estatisticas);
      set({ statistics: data.estatisticas });    } catch (error: unknown) {
      console.error("❌ Erro ao carregar estatísticas:", error);
      set({ statistics: null });
      throw error;
    }
  },
  fetchWorks: async (page = 1, limit = 5, search = "") => {
    const isSearchOperation = search !== get().searchTerm;

    set({
      isLoading: true,
      isSearching: isSearchOperation,
    });

    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({
          works: [],
          isLoading: false,
          isSearching: false,
          totalWorks: 0,
          totalPages: 0,
        });
        return;
      }

      // Construir URL com parâmetros
      const params = new URLSearchParams({
        userId: user.id,
        pagina: page.toString(),
        limite: limit.toString(),
      });

      if (search && search.trim()) {
        params.append("pesquisa", search.trim());
      }
      const url = `/api/works?${params.toString()}`;
      const startTime = performance.now();
      const response = await fetch(url);

      console.log("📡 Status da resposta:", response.status);
      console.log(
        "📡 Headers da resposta:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Resposta de erro do servidor:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.erro || `Erro HTTP ${response.status}`);
        } catch (parseError) {
          throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      const endTime = performance.now();

      console.log(
        `📡 Resposta da API (${(endTime - startTime).toFixed(2)}ms):`,
        data
      );

      console.log("✅ Obras carregadas:", {
        total: data.total,
        pagina: data.pagina,
        totalPaginas: data.totalPaginas,
        obras: data.obras?.length || 0,
        tempoResposta: `${(endTime - startTime).toFixed(2)}ms`,
      });      // Transformar dados da API para o formato do store
      const obras = data.obras || [];
      const transformedWorks: Work[] = obras.map((obra: ApiWork) => ({
        id: obra.id,
        title: obra.titulo,
        author: obra.autor,
        coauthor: obra.coautor,
        isrc: obra.isrc,
        iswc: obra.iswc,
        status: obra.status,
        files: obra.arquivos || [],
        createdAt: obra.dataCreacao,
        updatedAt: obra.dataAtualizacao,
        exclusiveCode: obra.codigoExclusivo,
        code: obra.codigo,
        userId: obra.profileId || obra.userId,
      }));

      set({
        works: transformedWorks,
        isLoading: false,
        isSearching: false,
        totalWorks: data.total,
        totalPages: data.totalPaginas,
        currentPage: data.pagina,
        searchTerm: search,
        statistics: data.estatisticas || get().statistics,
      });    } catch (error: unknown) {
      console.error("❌ Erro ao carregar obras:", error);

      // Log mais detalhado do erro
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("❌ Erro de rede ou fetch:", error);
      } else if (error instanceof Error) {
        if (error.message.includes("500")) {
          console.error("❌ Erro interno do servidor (500)");
        } else if (error.message.includes("404")) {
          console.error("❌ Endpoint não encontrado (404)");
        }
      }      set({
        isLoading: false,
        isSearching: false,
        works: [],
        totalWorks: 0,
        totalPages: 0,
      });

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Erro ao buscar obras: ${errorMessage}`);
    }
  },
  fetchWork: async (id: string) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ currentWork: null, isLoading: false });
        return;
      }

      console.log("🔍 Buscando obra específica:", id);

      // Chamar API para buscar obra específica
      const response = await fetch(`/api/works?id=${id}&userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Erro ao buscar obra:", errorData);
        throw new Error(errorData.erro || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Obra encontrada:", data);

      // Transformar dados da API para o formato do store
      const work: Work = {
        id: data.obra.id,
        title: data.obra.title,
        author: data.obra.author,
        coauthor: data.obra.coauthor,
        isrc: data.obra.isrc,
        iswc: data.obra.iswc,
        status: data.obra.status,        files:
          data.obra.files?.map((file: ApiWorkFile) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url,
            uploadedAt: file.uploadedAt,
          })) || [],
        createdAt: data.obra.created_at,
        updatedAt: data.obra.updated_at,
        code: data.obra.code,
        exclusiveCode: data.obra.exclusive_code,
        userId: user.id,
      };

      set({ currentWork: work, isLoading: false });    } catch (error: unknown) {
      console.error("❌ Erro ao buscar obra específica:", error);
      set({ isLoading: false, currentWork: null });
      throw error;
    }
  },

  createWork: async (workData: Partial<Work>) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Chamar API para criar obra
      const response = await fetch("/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: workData.title,
          author: workData.author,
          coauthor: workData.coauthor,
          isrc: workData.isrc,
          iswc: workData.iswc,
          description: "",
          files: [],
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao criar obra");
      }

      const newWork: Work = {
        id: data.obra.id,
        title: data.obra.title,
        author: data.obra.author,
        coauthor: data.obra.coauthor,
        isrc: data.obra.isrc,
        iswc: data.obra.iswc,
        status: data.obra.status,
        files: [],
        createdAt: data.obra.created_at,
        updatedAt: data.obra.updated_at,
        code: data.obra.code,
        userId: user.id,
      };

      // Atualizar lista local
      set((state) => ({
        works: [newWork, ...state.works],
        isLoading: false,
        totalWorks: state.totalWorks + 1,
      }));

      return newWork;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateWork: async (id: string, workData: Partial<Work>) => {
    try {
      // Em uma aplicação real, chamaria a API para atualizar
      const updatedWork = {
        ...get().works.find((w) => w.id === id),
        ...workData,
        updatedAt: dayjs().toISOString(),
      } as Work;      set((state) => ({
        works: state.works.map((work: Work) => (work.id === id ? updatedWork : work)),
        currentWork:
          state.currentWork?.id === id ? updatedWork : state.currentWork,
      }));
    } catch (error) {
      throw error;
    }
  },
  updateWorkStatus: async (id: string, status: Work["status"]) => {
    try {
      // Em uma aplicação real, chamaria a API para atualizar status
      set((state) => ({
        works: state.works.map((work: Work) =>
          work.id === id
            ? { ...work, status, updatedAt: dayjs().toISOString() }
            : work
        ),
        currentWork:
          state.currentWork?.id === id
            ? { ...state.currentWork, status, updatedAt: dayjs().toISOString() }
            : state.currentWork,
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteWork: async (id: string) => {
    try {
      // Em uma aplicação real, chamaria a API para deletar
      set((state) => ({
        works: state.works.filter((work) => work.id !== id),
        currentWork: state.currentWork?.id === id ? null : state.currentWork,
        totalWorks: Math.max(0, state.totalWorks - 1),
      }));
    } catch (error) {
      throw error;
    }
  },

  uploadFiles: async (workId: string, files: File[]) => {
    try {
      // Simular upload de arquivos
      await new Promise((resolve) => setTimeout(resolve, 1000));      const uploadedFiles: WorkFile[] = files.map((file: File, index: number) => ({
        id: (Date.now() + index).toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${file.name}`,
        uploadedAt: dayjs().toISOString(),
      }));

      return uploadedFiles;
    } catch (error) {
      throw error;
    }
  },

  searchPublicWork: async (code: string) => {
    try {
      // Simular busca pública
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Em uma aplicação real, chamaria API pública de busca
      const works = get().works;
      return works.find((w) => w.code === code) || null;
    } catch (error) {
      throw error;
    }
  },
}));
