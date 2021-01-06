function hnode(etree,pos)
	local char,l,r= sub(etree,pos,pos)
	if char=="." then
		l,pos=hnode(etree,pos+1)
		r,pos=hnode(etree,pos)
		return {l=l,r=r},pos
	else
		return tonum("0x"..sub(etree,pos,pos+1)),pos+2
	end
end

function huffman(arc)
	local tree,addr,mask=hnode(arc[2],1),arc[1],128
	return function()
		local node=tree
		while true do
			node=(peek(addr)&mask==0) and node.l or node.r
			mask/=2
			if mask<1 then
				mask=128
				addr+=1
			end
			if type(node)=="number" then
				return node
			end
		end
	end
end