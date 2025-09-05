import { toast } from 'react-toastify'

class TransactionService {
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      }

      const response = await this.apperClient.fetchRecords('transaction_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(item => ({
        Id: item.Id,
        type: item.type_c,
        amount: item.amount_c,
        category: item.category_c?.Name || item.category_c,
        date: item.date_c,
        description: item.description_c || ''
      })) || []
    } catch (error) {
      console.error("Error fetching transactions:", error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById('transaction_c', id, params)
      
      if (!response?.data) {
        return null
      }

      const item = response.data
      return {
        Id: item.Id,
        type: item.type_c,
        amount: item.amount_c,
        category: item.category_c?.Name || item.category_c,
        date: item.date_c,
        description: item.description_c || ''
      }
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error)
      return null
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: `${transactionData.type} - ${transactionData.amount}`,
          type_c: transactionData.type,
          amount_c: transactionData.amount,
          category_c: parseInt(transactionData.categoryId) || transactionData.category,
          date_c: transactionData.date,
          description_c: transactionData.description || ''
        }]
      }

      const response = await this.apperClient.createRecord('transaction_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            type: item.type_c,
            amount: item.amount_c,
            category: item.category_c?.Name || item.category_c,
            date: item.date_c,
            description: item.description_c || ''
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating transaction:", error)
      return null
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${transactionData.type} - ${transactionData.amount}`,
          type_c: transactionData.type,
          amount_c: transactionData.amount,
          category_c: parseInt(transactionData.categoryId) || transactionData.category,
          date_c: transactionData.date,
          description_c: transactionData.description || ''
        }]
      }

      const response = await this.apperClient.updateRecord('transaction_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            type: item.type_c,
            amount: item.amount_c,
            category: item.category_c?.Name || item.category_c,
            date: item.date_c,
            description: item.description_c || ''
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating transaction:", error)
      return null
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('transaction_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting transaction:", error)
      return false
    }
  }
}

export const transactionService = new TransactionService()