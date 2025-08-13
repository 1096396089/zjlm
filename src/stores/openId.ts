import { defineStore } from 'pinia'

const OPEN_ID_STORAGE_KEY = 'openId'

export const useOpenIdStore = defineStore('openIdStore', {
	state: () => ({
		openId: '' as string,
	}),
	actions: {
		setOpenId(id?: string | null) {
			const normalized = (id ?? '').toString()
			this.openId = normalized
			if (normalized) {
				localStorage.setItem(OPEN_ID_STORAGE_KEY, normalized)
			} else {
				localStorage.removeItem(OPEN_ID_STORAGE_KEY)
			}
		},
		initializeFromUrlOrStorage(initial?: string | null) {
			const fromParam = (initial ?? new URLSearchParams(window.location.search).get('openId')) || ''
			if (fromParam) {
				this.setOpenId(fromParam)
				return this.openId
			}
			const stored = localStorage.getItem(OPEN_ID_STORAGE_KEY) || ''
			if (stored) {
				this.openId = stored
			}
			return this.openId
		},
	},
})


