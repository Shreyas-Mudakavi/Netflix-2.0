import {
  DesktopComputerIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
} from '@heroicons/react/outline'
import { Product } from '@stripe/firestore-stripe-payments'
import { FaTv } from 'react-icons/fa'

interface Props {
  products: Product[]
  selectedPlan: Product | null
}

const Table = ({ products, selectedPlan }: Props) => {
  return (
    <table>
      <tbody>
        <tr className="tableRow border-b border-white/10 font-medium">
          <td className=" tableDataTitle">Monthly price</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              ₹{product.prices[0].unit_amount! / 100}
            </td>
          ))}
        </tr>
        <tr className="tableRow border-b border-white/10">
          <td className="tableDataTitle">Video quality</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.videoQuality}
            </td>
          ))}
        </tr>
        <tr className="tableRow border-b border-white/10">
          <td className="tableDataTitle">Resolution</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.resolution}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle  md:flex md:self-start">
            Devices you can use to watch
          </td>
          {products.map((product) => (
            <td
              className={`tableDataFeature flex flex-col space-y-5 self-start ${
                selectedPlan?.id === product.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.name === 'Mobile' && (
                <div className="relative space-y-5">
                  <DeviceMobileIcon className=" h-7 w-full  " />
                  <span>Phone</span>

                  <DeviceTabletIcon className="h-7 w-full -rotate-90" />
                  <span>Tablet</span>
                </div>
              )}
              {(product.name === 'Basic' ||
                product.name === 'Standard' ||
                product.name === 'Premium') && (
                <div>
                  <DeviceMobileIcon className="h-7 w-full" />
                  <span>Mobile</span>
                </div>
              )}
              {(product.name === 'Basic' ||
                product.name === 'Standard' ||
                product.name === 'Premium') && (
                <div>
                  <DeviceTabletIcon className="h-7 w-full -rotate-90" />
                  <span>Tablet</span>
                </div>
              )}
              {(product.name === 'Basic' ||
                product.name === 'Standard' ||
                product.name === 'Premium') && (
                <div>
                  <DesktopComputerIcon className="h-7 w-full" />
                  <span>Computer</span>
                </div>
              )}
              {(product.name === 'Basic' ||
                product.name === 'Standard' ||
                product.name === 'Premium') && (
                <div>
                  <FaTv className="h-7 w-full" />
                  <span>TV</span>
                </div>
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default Table
