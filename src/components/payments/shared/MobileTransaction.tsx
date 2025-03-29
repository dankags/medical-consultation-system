import { Transaction } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { extractInitials, formatDateTime, nameColor } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const MobileTransactionTable=({transaction}:{transaction:Transaction})=>{
    return(
        <div
        key={transaction.id}
        className="rounded-lg border border-slate-200 dark:border-neutral-700 p-4 bg-white dark:bg-transparent dark:hover:bg-dark-500/30"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {transaction.counterparty ? (
              <Avatar className="h-8 w-8 border border-slate-200 dark:border-neutral-700">
              <AvatarImage src={transaction.counterparty.avatar} alt={transaction.counterparty.name} />
              <AvatarFallback style={{backgroundColor:`${nameColor(transaction.counterparty.name||"John Doe")}`}} className="dark:text-black">
                {extractInitials(transaction.counterparty.name||"John Doe")}
              </AvatarFallback>
            </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-300 text-xs font-medium">
                  {transaction.type === "deposit"
                    ? "DEP"
                    : transaction.type === "withdrawal"
                      ? "WDR"
                      : transaction.type === "refund"
                        ? "REF"
                        : "PAY"}
                </span>
              </div>
            )}
            <div>
              <div className="font-medium">{transaction.description}</div>
              {transaction.counterparty && (
                <div className="text-sm text-slate-500 dark:text-neutral-400">
                  {transaction.counterparty.name}
                </div>
              )}
              {transaction.reference && (
                <div className="text-sm text-slate-500 dark:text-neutral-400">Ref: {transaction.reference}</div>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={`
              px-2.5 py-0.5 rounded-full font-medium capitalize
              ${
                transaction.type === "payment"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                  : transaction.type === "withdrawal"
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900"
                    : transaction.type === "refund"
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                      : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900"
              }
            `}
          >
            {transaction.type === "payment"
              ? "Payment"
              : transaction.type === "withdrawal"
                ? "Withdrawal"
                : transaction.type === "refund"
                  ? "Refund"
                  : "Deposit"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <div className="text-slate-500 dark:text-neutral-400">Date</div>
            <div>{formatDateTime(transaction.date).dateOnly}</div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-neutral-400">Status</div>
            <div className="flex items-center">
              <span
                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                  transaction.status === "completed"
                    ? "bg-emerald-500"
                    : transaction.status === "pending"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              <span className="capitalize">{transaction.status}</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-neutral-400">Amount</div>
            <div
              className={`font-medium ${
                transaction.type === "payment" || transaction.type === "refund"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : ""
              }`}
            >
              {transaction.type === "payment" || transaction.type === "refund" ? "+" : "-"}
              KSh {transaction.amount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-neutral-400">ID</div>
            <div className="font-mono text-xs">{transaction.id}</div>
          </div>
        </div>

        <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 dark:text-white dark:hover:bg-emerald-900/30">
            <MoreHorizontal className="h-4 w-4" />
            <span className="ml-1">Actions</span>
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">View details</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">Download receipt</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-neutral-700" />
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">Report issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
         
        </div>
      </div>
    )
}

export default MobileTransactionTable