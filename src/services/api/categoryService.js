import { toast } from 'react-toastify'

class CategoryService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "color_c"}}
        ]
      }

      const response = await this.apperClient.fetchRecords('category_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        type: item.type_c,
        icon: item.icon_c,
        color: item.color_c
      })) || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "color_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById('category_c', id, params)
      
      if (!response?.data) {
        return null
      }

      const item = response.data
      return {
        Id: item.Id,
        name: item.name_c || item.Name,
        type: item.type_c,
        icon: item.icon_c,
        color: item.color_c
      }
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error)
      return null
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "color_c"}}
        ],
        where: [{"FieldName": "type_c", "Operator": "EqualTo", "Values": [type]}]
      }

      const response = await this.apperClient.fetchRecords('category_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data?.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        type: item.type_c,
        icon: item.icon_c,
        color: item.color_c
      })) || []
    } catch (error) {
      console.error("Error fetching categories by type:", error)
      return []
    }
  }
}

export const categoryService = new CategoryService()