import { memo, useContext, useState } from 'react'

import Async from 'react-select/async'
import { WindowedMenuList } from 'react-windowed-select'

import { buildURLParams } from '../../../core/services/buildURLParams'

import { TagSearchRequest } from '../../../core/@types/api/TagSearchRequest'
import { TagSearchResponse } from '../../../core/@types/api/TagSearchResponse'
import { SearchBarContext } from '../../../context/SearchBarContext'

export const TagSeachBar = memo(() => {
  const searchBarContext = useContext(SearchBarContext)
  const [tags, setTags] = searchBarContext.tags

  const [loading, setLoading] = useState(false)
  const tagLoadOptions = async (inputValue: string) => {
    try {
      setLoading(true)

      const tagSearchPayload: TagSearchRequest = {
        query: inputValue,
        selectedTags: tags,
      }

      const expectedResults: TagSearchResponse = await fetch(
        `/api/tagSearch?${buildURLParams(tagSearchPayload)}`
      ).then(o => o.json())

      return expectedResults.tags.map(tag => ({
        value: tag.name.original,
        label: (
          <p className="flex items-center">
            <span className="font-medium">{tag.name.original}</span>
            <span className="ml-2 text-gray-500 text-sm">
              {tag.name.translated}
            </span>
            <span className="text-xs text-white bg-gray-900 py-0.5 px-2 rounded-md ml-2">
              {tag.count}
            </span>
          </p>
        ),
      }))
    } catch (e) {
      console.error(e)
      return []
    } finally {
      setLoading(false)
    }
  }

  return (
    <Async
      isMulti
      loadOptions={tagLoadOptions}
      isLoading={loading}
      onChange={val => setTags(val.map(o => o.value))}
      components={{
        MenuList: WindowedMenuList,
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: 'hsl(0deg 0% 7.06%)', // Dark background for the control
          borderColor: 'hsl(0, 0%, 20%)', // Optional: Change border color if needed
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: 'hsl(0deg 0% 7.06%)', // Dark background for the dropdown menu
          zIndex: 10,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'hsl(0deg 0% 15%)' : 'hsl(0deg 0% 7.06%)', // Dark background for options
          color: state.isSelected ? 'white' : 'gray', // Change text color if needed
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'white', // Text color of the selected value
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'gray', // Placeholder text color
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          backgroundColor: 'transparent', // Hide separator if needed
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: 'white', // Dropdown indicator color
        }),
		input: (provided) => ({
          ...provided,
          color: 'white', // Text color when typing
        }),
      }}
    />
  )
})
