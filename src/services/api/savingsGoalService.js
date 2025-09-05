import { toast } from 'react-toastify'

class SavingsGoalService {
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
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}}
        ]
      }

      const response = await this.apperClient.fetchRecords('savings_goal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        targetAmount: item.target_amount_c,
        currentAmount: item.current_amount_c,
        deadline: item.deadline_c
      })) || []
    } catch (error) {
      console.error("Error fetching savings goals:", error)
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
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById('savings_goal_c', id, params)
      
      if (!response?.data) {
        return null
      }

      const item = response.data
      return {
        Id: item.Id,
        name: item.name_c || item.Name,
        targetAmount: item.target_amount_c,
        currentAmount: item.current_amount_c,
        deadline: item.deadline_c
      }
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error)
      return null
    }
  }

  async create(goalData) {
    try {
      const params = {
        records: [{
          Name: goalData.name,
          name_c: goalData.name,
          target_amount_c: goalData.targetAmount,
          current_amount_c: goalData.currentAmount,
          deadline_c: goalData.deadline
        }]
      }

      const response = await this.apperClient.createRecord('savings_goal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} savings goals:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            name: item.name_c || item.Name,
            targetAmount: item.target_amount_c,
            currentAmount: item.current_amount_c,
            deadline: item.deadline_c
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating savings goal:", error)
      return null
    }
  }

  async update(id, goalData) {
    try {
      const updateData = {
        Id: parseInt(id)
      }

      if (goalData.name !== undefined) {
        updateData.Name = goalData.name
        updateData.name_c = goalData.name
      }
      if (goalData.targetAmount !== undefined) updateData.target_amount_c = goalData.targetAmount
      if (goalData.currentAmount !== undefined) updateData.current_amount_c = goalData.currentAmount
      if (goalData.deadline !== undefined) updateData.deadline_c = goalData.deadline

      const params = {
        records: [updateData]
      }

      const response = await this.apperClient.updateRecord('savings_goal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} savings goals:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            name: item.name_c || item.Name,
            targetAmount: item.target_amount_c,
            currentAmount: item.current_amount_c,
            deadline: item.deadline_c
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating savings goal:", error)
      return null
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('savings_goal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} savings goals:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting savings goal:", error)
      return false
    }
  }
}

export const savingsGoalService = new SavingsGoalService()