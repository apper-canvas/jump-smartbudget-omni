import { toast } from 'react-toastify'

class BudgetService {
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
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "alert_threshold_c"}},
          {"field": {"Name": "alert_methods_c"}},
          {"field": {"Name": "category_c"}}
        ]
      }

      const response = await this.apperClient.fetchRecords('budget_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(item => ({
        Id: item.Id,
        category: item.category_c?.Name || item.category_c,
        monthlyLimit: item.monthly_limit_c,
        spent: item.spent_c,
        month: item.month_c,
        alertThreshold: item.alert_threshold_c || 80,
        alertMethods: item.alert_methods_c ? item.alert_methods_c.split(',') : ["email", "push"]
      })) || []
    } catch (error) {
      console.error("Error fetching budgets:", error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "alert_threshold_c"}},
          {"field": {"Name": "alert_methods_c"}},
          {"field": {"Name": "category_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById('budget_c', id, params)
      
      if (!response?.data) {
        return null
      }

      const item = response.data
      return {
        Id: item.Id,
        category: item.category_c?.Name || item.category_c,
        monthlyLimit: item.monthly_limit_c,
        spent: item.spent_c,
        month: item.month_c,
        alertThreshold: item.alert_threshold_c || 80,
        alertMethods: item.alert_methods_c ? item.alert_methods_c.split(',') : ["email", "push"]
      }
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error)
      return null
    }
  }

  async create(budgetData) {
    try {
      const params = {
        records: [{
          Name: `${budgetData.category} Budget`,
          monthly_limit_c: budgetData.monthlyLimit,
          spent_c: budgetData.spent || 0,
          month_c: budgetData.month,
          alert_threshold_c: budgetData.alertThreshold || 80,
          alert_methods_c: budgetData.alertMethods ? budgetData.alertMethods.join(',') : 'email,push',
          category_c: parseInt(budgetData.categoryId) || budgetData.category
        }]
      }

      const response = await this.apperClient.createRecord('budget_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            category: item.category_c?.Name || item.category_c,
            monthlyLimit: item.monthly_limit_c,
            spent: item.spent_c,
            month: item.month_c,
            alertThreshold: item.alert_threshold_c || 80,
            alertMethods: item.alert_methods_c ? item.alert_methods_c.split(',') : ["email", "push"]
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating budget:", error)
      return null
    }
  }

  async update(id, budgetData) {
    try {
      const updateData = {
        Id: parseInt(id)
      }

      if (budgetData.monthlyLimit !== undefined) updateData.monthly_limit_c = budgetData.monthlyLimit
      if (budgetData.spent !== undefined) updateData.spent_c = budgetData.spent
      if (budgetData.month !== undefined) updateData.month_c = budgetData.month
      if (budgetData.alertThreshold !== undefined) updateData.alert_threshold_c = budgetData.alertThreshold
      if (budgetData.alertMethods !== undefined) updateData.alert_methods_c = budgetData.alertMethods.join(',')
      if (budgetData.categoryId !== undefined) updateData.category_c = parseInt(budgetData.categoryId)

      const params = {
        records: [updateData]
      }

      const response = await this.apperClient.updateRecord('budget_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            category: item.category_c?.Name || item.category_c,
            monthlyLimit: item.monthly_limit_c,
            spent: item.spent_c,
            month: item.month_c,
            alertThreshold: item.alert_threshold_c || 80,
            alertMethods: item.alert_methods_c ? item.alert_methods_c.split(',') : ["email", "push"]
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating budget:", error)
      return null
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('budget_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting budget:", error)
      return false
    }
  }
}

export const budgetService = new BudgetService()